<template>
  <div class="pay-qrcode">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
<script setup>
import QRCode from 'qrcode'
import { defineProps, onMounted, ref, watch } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  size: { type: Number, default: 200 },
  cornerColor: { type: String, default: 'var(--adm-color-primary)' },
  cornerWidth: { type: Number, default: 2 },
  cornerLength: { type: Number, default: 16 },
  cornerOffset: { type: Number, default: 10 },
})

const canvasRef = ref(null)

const getCssVarColor = (cssVar) => {
  if (!cssVar.startsWith('var(')) return cssVar
  const varName = cssVar.slice(4, -1).trim()
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#FFFFFF'
}

const drawCorners = (ctx, size, color, lineWidth, len) => {
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth
  ctx.lineJoin = 'miter'
  ctx.lineCap = 'square'

  const half = lineWidth / 2

  // 左上
  ctx.beginPath()
  ctx.moveTo(half, len + half)
  ctx.lineTo(half, half)
  ctx.lineTo(len + half, half)
  ctx.stroke()

  // 右上
  ctx.beginPath()
  ctx.moveTo(size - len - half, half)
  ctx.lineTo(size - half, half)
  ctx.lineTo(size - half, len + half)
  ctx.stroke()

  // 左下
  ctx.beginPath()
  ctx.moveTo(half, size - len - half)
  ctx.lineTo(half, size - half)
  ctx.lineTo(len + half, size - half)
  ctx.stroke()

  // 右下
  ctx.beginPath()
  ctx.moveTo(size - len - half, size - half)
  ctx.lineTo(size - half, size - half)
  ctx.lineTo(size - half, size - len - half)
  ctx.stroke()
}

const renderQrcode = async () => {
  if (!canvasRef.value || !props.text) return

  const canvas = canvasRef.value
  const dpr = window.devicePixelRatio || 1

  // 让 canvas 真实像素 = size * dpr，避免模糊和线宽问题
  canvas.width = props.size * dpr
  canvas.height = props.size * dpr
  canvas.style.width = props.size + 'px'
  canvas.style.height = props.size + 'px'

  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0) // 所有绘制按逻辑尺寸算

  const padding = props.cornerOffset
  const qrSize = props.size - padding * 2

  // 临时 canvas 生成二维码
  const tempCanvas = document.createElement('canvas')
  await QRCode.toCanvas(tempCanvas, props.text, {
    width: qrSize,
    margin: 0,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#FFFFFF',
    },
  })

  // 清空主画布
  ctx.clearRect(0, 0, props.size, props.size)

  // 把二维码画到中间留 padding 的位置
  ctx.drawImage(tempCanvas, padding, padding)

  const color = getCssVarColor(props.cornerColor)
  drawCorners(ctx, props.size, color, props.cornerWidth, props.cornerLength)
}

onMounted(renderQrcode)
watch(() => props.text, renderQrcode)
</script>
