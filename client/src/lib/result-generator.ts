import { AnalysisResult } from "@shared/schema";

export function generateShareText(result: AnalysisResult): string {
  return `나의 KPOP 데뷔 포지션: ${result.position}! 
그룹명: ${result.groupName}
캐릭터: ${result.character}
${Array.isArray(result.styleTags) ? result.styleTags.join(' ') : ''}

#KPOP데뷔분석기 #아이돌포지션`;
}

export function generateResultCardCanvas(result: AnalysisResult): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Set canvas size for Instagram square format
  canvas.width = 1080;
  canvas.height = 1080;
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#a855f7');
  gradient.addColorStop(0.5, '#ec4899');
  gradient.addColorStop(1, '#ef4444');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // White inner card
  const margin = 60;
  const cardX = margin;
  const cardY = margin;
  const cardWidth = canvas.width - (margin * 2);
  const cardHeight = canvas.height - (margin * 2);
  
  ctx.fillStyle = 'white';
  ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 40);
  ctx.fill();
  
  // Text content
  ctx.fillStyle = '#374151';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  
  const centerX = canvas.width / 2;
  let currentY = cardY + 200;
  
  // Group name
  ctx.font = '32px sans-serif';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(result.groupName, centerX, currentY);
  currentY += 80;
  
  // Position
  ctx.font = 'bold 56px sans-serif';
  ctx.fillStyle = '#ec4899';
  ctx.fillText(result.position, centerX, currentY);
  currentY += 80;
  
  if (result.subPosition) {
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(`• ${result.subPosition}`, centerX, currentY);
    currentY += 100;
  }
  
  // Character
  ctx.font = '36px sans-serif';
  ctx.fillStyle = '#374151';
  ctx.fillText(result.character, centerX, currentY);
  currentY += 120;
  
  // Style tags
  if (Array.isArray(result.styleTags)) {
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#ec4899';
    const tagsText = result.styleTags.slice(0, 2).join(' ');
    ctx.fillText(tagsText, centerX, currentY);
    currentY += 80;
  }
  
  // Footer
  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#9ca3af';
  ctx.fillText('KPOP 데뷔 분석기', centerX, canvas.height - 100);
  
  return canvas;
}

export function downloadResultCard(result: AnalysisResult) {
  const canvas = generateResultCardCanvas(result);
  
  // Convert to blob and download
  canvas.toBlob((blob) => {
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kpop-result-${result.groupName}-${result.position}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, 'image/png');
}
