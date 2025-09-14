import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

function getErrorCode(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'cause' in error) {
    const cause = (error as { cause?: unknown }).cause;
    if (cause && typeof cause === 'object' && 'code' in cause) {
      return (cause as { code?: string }).code;
    }
  }
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Требуется авторизация' }, { status: 401 });
    }

    const { method, url, headers, body } = await request.json();

    if (!method || !url) {
      return NextResponse.json({ error: 'Метод и URL обязательны' }, { status: 400 });
    }

    const startTime = Date.now();

    const response = await fetch(url, {
      method,
      headers: {
        ...headers,
        'User-Agent': 'Swagger-Lite-MVP/1.0',
      },
      body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? undefined : body,
      signal: AbortSignal.timeout(30000),
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    const contentType = response.headers.get('content-type') || '';
    let responseData: unknown;

    if (contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch {
        responseData = await response.text();
      }
    } else {
      responseData = await response.text();
    }

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data: responseData,
      size: JSON.stringify(responseData).length,
      duration,
      timestamp: Date.now(),
    });
  } catch (error: unknown) {
    let errorMessage = 'Неизвестная ошибка';
    let status = 500;

    const errorCode = getErrorCode(error);
    const message = getErrorMessage(error);

    if (message.includes('AbortError') || message.includes('timeout')) {
      errorMessage = 'Превышен лимит времени ожидания (30 секунд)';
      status = 408;
    } else if (errorCode === 'ENOTFOUND') {
      errorMessage = 'Не удалось найти хост';
      status = 404;
    } else if (errorCode === 'ECONNREFUSED') {
      errorMessage = 'Соединение отклонено';
      status = 503;
    } else {
      errorMessage = message;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        timestamp: Date.now(),
      },
      { status },
    );
  }
}
