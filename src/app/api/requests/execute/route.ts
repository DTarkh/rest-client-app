import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

type FetchResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: unknown;
  size: number;
  duration: number;
  timestamp: number;
};

type ErrorResponse = {
  error: string;
  timestamp: number;
};

type CustomError = {
  name: string;
  cause?: {
    code?: string;
  };
  message: string;
} & Error;

export async function POST(request: NextRequest) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401, headers: corsHeaders },
      );
    }

    const { method, url, headers, body } = await request.json();

    if (!method || !url) {
      return NextResponse.json(
        { error: 'Метод и URL обязательны' },
        { status: 400, headers: corsHeaders },
      );
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...(headers as Record<string, string>),
          'User-Agent': 'Swagger-Lite-MVP/1.0',
        },
        body: ['GET', 'HEAD'].includes(method.toUpperCase()) ? undefined : body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

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

      const result: FetchResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data: responseData,
        size: JSON.stringify(responseData).length,
        duration,
        timestamp: Date.now(),
      };

      return NextResponse.json(result, {
        headers: corsHeaders,
      });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    const customError = error as CustomError;
    let errorMessage = 'Неизвестная ошибка';
    let status = 500;

    if (customError.name === 'AbortError') {
      errorMessage = 'Превышен лимит времени ожидания (30 секунд)';
      status = 408;
    } else if (customError.cause?.code === 'ENOTFOUND') {
      errorMessage = 'Не удалось найти хост';
      status = 404;
    } else if (customError.cause?.code === 'ECONNREFUSED') {
      errorMessage = 'Соединение отклонено';
      status = 503;
    } else if (customError.message) {
      errorMessage = customError.message;
    }

    const errorResponse: ErrorResponse = {
      error: errorMessage,
      timestamp: Date.now(),
    };

    return NextResponse.json(errorResponse, {
      status,
      headers: corsHeaders,
    });
  }
}
