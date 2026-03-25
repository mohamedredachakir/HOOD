<template>
  <div class="ann">
    <div class="ann-inner">
      <span class="ann-seg">FREE SHIPPING OVER 500 MAD &nbsp;•&nbsp; NEW DROP: VOID SERIES 002 &nbsp;•&nbsp; LIMITED QUANTITIES &nbsp;•&nbsp; HOOD™ — ONE BRAND ONE PRODUCT &nbsp;•&nbsp; 380GSM MINIMUM &nbsp;•&nbsp; RESTOCKED: CORE BLACK &nbsp;•&nbsp; ARCHIVE: LAST SIZES &nbsp;•&nbsp;</span>
      <span class="ann-seg">FREE SHIPPING OVER 500 MAD &nbsp;•&nbsp; NEW DROP: VOID SERIES 002 &nbsp;•&nbsp; LIMITED QUANTITIES &nbsp;•&nbsp; HOOD™ — ONE BRAND ONE PRODUCT &nbsp;•&nbsp; 380GSM MINIMUM &nbsp;•&nbsp; RESTOCKED: CORE BLACK &nbsp;•&nbsp; ARCHIVE: LAST SIZES &nbsp;•&nbsp;</span>
    </div>
  </div>
</template>

<style scoped>
.ann {
  background: var(--w);
  color: var(--void);
  height: 30px;
  display: flex;
  align-items: center;
  overflow: hidden;
  font-family: var(--font-d);
  font-size: 10px;
  letter-spacing: .12em;
}

.ann-inner {
  display: flex;
  white-space: nowrap;
  animation: ticker 35s linear infinite;
}

.ann-seg {
  padding: 0 48px;
}

@keyframes ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>
