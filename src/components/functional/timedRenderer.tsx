import type React from "react";
import { useEffect, useState } from "react";

type TimedRenderProps = {
  duration: number;
  children?: React.ReactNode;
};

export const TimedRender: React.FC<TimedRenderProps> = ({
  duration = 500,
  children,
}) => {
  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    // triggerが変更されたらshowをtrueに設定し、n秒後にfalseに戻す
    setShow(true);
    const timer = setTimeout(() => {
      setShow(false);
    }, duration);

    // コンポーネントが再レンダリングやアンマウントされる際にタイマーをクリア
    return () => clearTimeout(timer);
  }, [duration]);

  return <>{show && <div>{children}</div>}</>;
};
