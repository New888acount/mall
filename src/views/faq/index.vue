<template>
  <div class="faq-page">
    <MobileHeader :leftText="$t('faq')" class="faq-header" :backicon="true"></MobileHeader>

    <div class="faq-list">
      <div class="faq-item">
        <div class="item-title">¿Puedo hacer un ingreso utilizando la cuenta de pago de otra persona?</div>
        <div class="item-text">
          <p>
            Está estrictamente prohibido y es ilegal utilizar la cuenta de pago de otra persona para realizar un
            depósito. Si ha depositado accidentalmente en 1234 utilizando la cuenta de pago de otra persona,
            notifíquenoslo inmediatamente poniéndose en contacto con el servicio de asistencia a través del chat en
            vivo.
          </p>
        </div>
      </div>
      <div class="faq-item">
        <div class="item-title">¿Puedo hacer un ingreso utilizando la cuenta de pago de otra persona?</div>
        <div class="item-text">
          <p>
            Está estrictamente prohibido y es ilegal utilizar la cuenta de pago de otra persona para realizar un
            depósito. Si ha depositado accidentalmente en 1234 utilizando la cuenta de pago de otra persona,
            notifíquenoslo inmediatamente poniéndose en contacto con el servicio de asistencia a través del chat en
            vivo.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import { ref, onMounted } from 'vue'
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'

/** ***引入相关包end*****/
/** ***ref、reactive、props，等……start*****/

/** ***ref、reactive、props，等……end*****/
/** ***函数 start*****/

/** ***函数 end*****/
/** ***生命周期start*****/
onMounted(() => {})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.faq-page {
  .faq-header {
    :deep(.title) {
      color: var(--adm-color-textLv1);
      font-weight: 600;
    }
  }

  .faq-list {
    padding: 8px;
    .faq-item {
      margin-bottom: 10px;
      color: var(--adm-color-textLv1);
      .item-title {
        font-size: 18px;
        margin-bottom: 10px;
        font-weight: 600;
      }
      .item-text {
        font-size: 15px;
        // color: var(--color-textlv2);
      }
    }
  }
}
</style>
