import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

type Point = { x: number; y: number };

const CanvasSplit: React.FC = () => {
  // キャプチャ対象のHTML部分（例：画像やテキストを含む四角形）
  const htmlRef = useRef<HTMLDivElement>(null);
  // ユーザーに表示する「元画像」のcanvas
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  // 分割後の上部と下部を表示するcanvas（ここでは絶対配置）
  const upperCanvasRef = useRef<HTMLCanvasElement>(null);
  const lowerCanvasRef = useRef<HTMLCanvasElement>(null);
  // html2canvasでキャプチャした画像（オフスクリーン）を保持
  const capturedCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // ユーザーが描く分割線の座標列とドラッグ状態の管理
  const [freehandPoints, setFreehandPoints] = useState<Point[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  // 分割処理実行後は splitDone を true にする
  const [splitDone, setSplitDone] = useState(false);
  // アニメーション用：上部のcanvasの垂直オフセット
  const [animationOffset, setAnimationOffset] = useState(0);

  // HTML要素をキャプチャして originalCanvas に描画し、capturedCanvasRef に保持
  const captureHtmlAndStore = async () => {
    if (htmlRef.current) {
      const capturedCanvas = await html2canvas(htmlRef.current);
      capturedCanvasRef.current = capturedCanvas;
      if (originalCanvasRef.current) {
        originalCanvasRef.current.width = capturedCanvas.width;
        originalCanvasRef.current.height = capturedCanvas.height;
        const ctx = originalCanvasRef.current.getContext("2d");
        if (ctx) {
          ctx.drawImage(capturedCanvas, 0, 0);
        }
      }
    }
  };

  // マウス操作でフリーハンド線を記録
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!originalCanvasRef.current) return;
    setIsDrawing(true);
    const rect = originalCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFreehandPoints([{ x, y }]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !originalCanvasRef.current) return;
    const rect = originalCanvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFreehandPoints((prev) => [...prev, { x, y }]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // freehandPoints 更新時、描画中は元のキャプチャ画像に線を重ね描画
  useEffect(() => {
    if (isDrawing && originalCanvasRef.current && capturedCanvasRef.current) {
      const ctx = originalCanvasRef.current.getContext("2d");
      if (!ctx) return;
      // キャプチャ画像を再描画
      ctx.clearRect(
        0,
        0,
        originalCanvasRef.current.width,
        originalCanvasRef.current.height
      );
      ctx.drawImage(capturedCanvasRef.current, 0, 0);
      // 分割線を描画
      if (freehandPoints.length > 0) {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(freehandPoints[0].x, freehandPoints[0].y);
        freehandPoints.forEach((pt) => ctx.lineTo(pt.x, pt.y));
        ctx.stroke();
      }
    }
  }, [freehandPoints, isDrawing]);

  // 分割処理：ユーザーのフリーハンド線を境界に上部と下部の領域を切り出す
  const splitCanvas = () => {
    if (!capturedCanvasRef.current || freehandPoints.length < 2) return;
    const width = capturedCanvasRef.current.width;
    const height = capturedCanvasRef.current.height;

    // 上部のクリッピング領域：
    // ①ユーザーが描いた線（左端から右端）を下端境界とし、
    // ②上側は画面上端で閉じた多角形を作成
    const upperCanvas = document.createElement("canvas");
    upperCanvas.width = width;
    upperCanvas.height = height;
    const upperCtx = upperCanvas.getContext("2d");
    if (upperCtx) {
      upperCtx.save();
      upperCtx.beginPath();
      // ユーザーの線（左から右）
      upperCtx.moveTo(freehandPoints[0].x, freehandPoints[0].y);
      for (let i = 1; i < freehandPoints.length; i++) {
        upperCtx.lineTo(freehandPoints[i].x, freehandPoints[i].y);
      }
      // 右上端、左上端を経由して閉じる
      upperCtx.lineTo(width, 0);
      upperCtx.lineTo(0, 0);
      upperCtx.closePath();
      upperCtx.clip();
      // キャプチャ画像を描画
      upperCtx.drawImage(capturedCanvasRef.current, 0, 0);
      upperCtx.restore();
    }

    // 下部のクリッピング領域：
    // ①ユーザーの線を境界とし、
    // ②下側は画面下端で閉じた多角形
    const lowerCanvas = document.createElement("canvas");
    lowerCanvas.width = width;
    lowerCanvas.height = height;
    const lowerCtx = lowerCanvas.getContext("2d");
    if (lowerCtx) {
      lowerCtx.save();
      lowerCtx.beginPath();
      // ユーザーの線（右端から左端へ）
      lowerCtx.moveTo(
        freehandPoints[freehandPoints.length - 1].x,
        freehandPoints[freehandPoints.length - 1].y
      );
      for (let i = freehandPoints.length - 2; i >= 0; i--) {
        lowerCtx.lineTo(freehandPoints[i].x, freehandPoints[i].y);
      }
      // 左下端、右下端を経由して閉じる
      lowerCtx.lineTo(0, height);
      lowerCtx.lineTo(width, height);
      lowerCtx.closePath();
      lowerCtx.clip();
      lowerCtx.drawImage(capturedCanvasRef.current, 0, 0);
      lowerCtx.restore();
    }

    // 分割結果をそれぞれのcanvasに描画
    if (upperCanvasRef.current) {
      upperCanvasRef.current.width = width;
      upperCanvasRef.current.height = height;
      const ctx = upperCanvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(upperCanvas, 0, 0);
      }
    }
    if (lowerCanvasRef.current) {
      lowerCanvasRef.current.width = width;
      lowerCanvasRef.current.height = height;
      const ctx = lowerCanvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(lowerCanvas, 0, 0);
      }
    }
    setSplitDone(true);
  };

  // 上部のcanvasをアニメーションで上へ移動させる
  useEffect(() => {
    if (!splitDone) return;
    let animationFrame: number;
    const animate = () => {
      setAnimationOffset((prev) => {
        const newOffset = prev - 2; // 1フレームあたり2px上昇
        if (upperCanvasRef.current) {
          upperCanvasRef.current.style.top = newOffset + "px";
        }
        return newOffset;
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [splitDone]);

  return (
    <div style={{ position: "relative" }}>
      {/* キャプチャ対象のHTML（複雑な四角形：画像・テキストなど） */}
      <div
        ref={htmlRef}
        style={{
          padding: "20px",
          background: "#eee",
          marginBottom: "10px",
        }}
      >
        <h1>複雑な四角形</h1>
        <img src="https://via.placeholder.com/150" alt="サンプル画像" />
        <p>これは画像やテキストを含むHTMLのサンプルです。</p>
      </div>
      <button onClick={captureHtmlAndStore}>HTMLをCanvasに変換</button>
      <div style={{ position: "relative", marginTop: "10px" }}>
        {/* 元のキャプチャ画像と分割線を描くためのcanvas */}
        <canvas
          ref={originalCanvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ border: "1px solid black", cursor: "crosshair" }}
        />
      </div>
      {/* ユーザーが線を描いたら「分割して上部を移動」ボタンを表示 */}
      {!splitDone && freehandPoints.length > 1 && (
        <button onClick={splitCanvas} style={{ marginTop: "10px" }}>
          分割して上部を移動
        </button>
      )}
      {/* 分割後の結果：下部は固定、上部はアニメーションで上に移動 */}
      {splitDone && (
        <>
          <canvas
            ref={lowerCanvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              border: "1px solid blue",
            }}
          />
          <canvas
            ref={upperCanvasRef}
            style={{
              position: "absolute",
              top: animationOffset,
              left: 0,
              border: "1px solid red",
            }}
          />
        </>
      )}
    </div>
  );
};

export default CanvasSplit;
