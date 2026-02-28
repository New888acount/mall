<template>
  <baseModule
    class="cube-item"
    @click="handleClick"
    :item="details"
    :showUpdate="true"
    @handleFavorite="handleFavorite"
  />
</template>

<script setup>
import { addFavoriteApi, cancelFavoriteApi } from '@/api/home'
// import MyImage from '@/components/MyImage'
import ShowLogin from '@/componentsFun/login/index.js'
import useUserInfoStore from '@/store/modules/userInfo'
import { customToast } from '@/utils/index.js'
import { defineEmits, defineProps, ref } from 'vue'

import baseModule from '@/views/home/components/FavoriteItem/baseModule.vue'

const userInfoStore = useUserInfoStore()

const props = defineProps({
  item: { type: Object, required: true },
  callback: {
    type: Function,
    default: () => null,
  },
})

const emit = defineEmits(['click'])

const details = ref(props.item)

function handleClick() {
  emit('click', props.item)
}

const handleFavorite = async (obj) => {
  if (!userInfoStore.token) {
    ShowLogin()
    return
  }
  try {
    const { msg } = obj?.isFavorite
      ? await cancelFavoriteApi({ productId: obj?.id })
      : await addFavoriteApi({ productId: obj?.id })
    details.value.isFavorite = !details.value.isFavorite
    customToast(msg)
    props.callback && props.callback(true)
  } catch (error) {
    console.log(error)
  }
}
</script>

<style scoped lang="less"></style>
