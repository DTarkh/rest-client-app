import { useCallback, useState } from 'react';

type BodyType = 'json' | 'text' | 'none';

type UseRequestBodyProps = {
  initialBody?: string;
  initialType?: BodyType;
};

type UseRequestBodyReturn = {
  body: string;
  bodyType: BodyType;
  setBody: (body: string, type: BodyType) => void;
  setBodyType: (type: BodyType) => void;
  prettifyJson: () => void;
  isJsonValid: boolean;
};

export const useRequestBody = ({
  initialBody = '',
  initialType = 'none',
}: UseRequestBodyProps): UseRequestBodyReturn => {
  const [body, setBodyState] = useState(initialBody);
  const [bodyType, setBodyTypeState] = useState<BodyType>(initialType);

  const setBody = useCallback((newBody: string, type: BodyType) => {
    setBodyState(newBody);
    setBodyTypeState(type);
  }, []);

  const setBodyType = useCallback((type: BodyType) => {
    setBodyTypeState(type);
    if (type === 'none') {
      setBodyState('');
    }
  }, []);

  const prettifyJson = useCallback(() => {
    if (bodyType === 'json' && body.trim()) {
      try {
        const parsed = JSON.parse(body);
        const prettified = JSON.stringify(parsed, null, 2);
        setBodyState(prettified);
      } catch {
        return;
      }
    }
  }, [body, bodyType]);

  const isJsonValid = useCallback(() => {
    if (bodyType === 'json' && body.trim()) {
      try {
        JSON.parse(body);
        return true;
      } catch {
        return false;
      }
    }
    return true;
  }, [body, bodyType]);

  return {
    body,
    bodyType,
    setBody,
    setBodyType,
    prettifyJson,
    isJsonValid: isJsonValid(),
  };
};
