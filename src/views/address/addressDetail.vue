<template>
  <div class="address-detail" v-loading="loading">
    <MobileHeader :title="$t('addressDetail.title')" class="cart-header" :backicon="false"></MobileHeader>

    <div class="address-form">
      <van-form @submit="onSubmit" @failed="onFailed">
        <van-cell-group inset>
          <van-field
            v-model="state.model.name"
            name="name"
            :label="$t('addressDetail.name')"
            :placeholder="$t('addressDetail.name.placeholder')"
            :rules="rules.name"
            clearable
          />
          <van-field
            v-model="state.model.phone"
            name="phone"
            :label="$t('addressDetail.number')"
            :placeholder="$t('addressDetail.number.placeholder')"
            :rules="rules.phone"
            clearable
          />
          <van-field
            v-model="state.model.detailAddress"
            name="detailAddress"
            rows="3"
            autosize
            :label="$t('addressDetail.detail')"
            :placeholder="$t('addressDetail.detail.placeholder')"
            type="textarea"
            clearable
            :rules="rules.detailAddress"
          />
          <van-field
            v-model="state.model.region"
            is-link
            readonly
            name="region"
            :label="$t('addressDetail.city')"
            :placeholder="$t('addressDetail.city.placeholder')"
            :rules="rules.region"
            @click="state.showRegion = true"
          />
          <van-popup v-model:show="state.showRegion" destroy-on-close position="bottom">
            <van-area
              :area-list="state.areaList"
              :model-value="state.model.fullArea"
              @confirm="onConfirm"
              @cancel="state.showRegion = false"
            />
          </van-popup>

          <van-field name="switch" :label="$t('addressDetail.default')" class="switch">
            <template #input>
              <van-switch
                v-model="state.model.is_default"
                size="22px"
                inactive-color="#d6d6d6"
                active-color="var(--color-light)"
              />
            </template>
          </van-field>
        </van-cell-group>
        <!-- <div style="margin: 16px"> -->
        <van-button round block type="primary" class="save" native-type="submit">
          <!-- <p> -->
          {{ $t('addressDetail.submit') }}

          <!-- </p> -->
        </van-button>
        <!-- </div> -->
      </van-form>
    </div>

    <!-- <div class="save">
      <p>保存</p>
    </div> -->
  </div>
</template>

<script setup>
/** ***引入相关包start*****/
import MobileHeader from '@/components/MyPageHeader/mobile/index.vue'
import { defineProps, onMounted, reactive, ref, watch } from 'vue'
// import { areaList } from '@vant/area-data'
import { addressDetailApi, areaApi, createAddressApi, updateAddressApi } from '@/api/address'
import useLocalCache from '@/hooks/storage/localStorage.js'
import router from '@/router'
import { useRoute } from 'vue-router'
import { customToast } from '@/utils'
/** ***引入相关包end*****/

/** ***ref、reactive、props，等……start*****/
const route = useRoute()
const { getAreaHistory, setAreaHistory } = useLocalCache()

defineProps({
  detail: {
    type: String,
    default: '',
  },
})

const state = reactive({
  showRegion: false,
  model: {
    name: '',
    phone: '',
    detailAddress: '',
    is_default: false,
    region: '',
    fullArea: [],
  },
  // rules: {
  //   name,
  //   phone,
  //   detailAddress,
  //   region,
  // },
  areaList: {},
})

const loading = ref(false)

// 登录
const validatePhone = (value) => {
  const reg = /^1[23456789]\d{9}$/ // 手机号正则
  if (!value) {
    return '请输入手机号'
  } else if (!reg.test(value)) {
    return '手机号码格式不正确'
  }
}
const rules = {
  name: [
    {
      required: true,
      message: '请输入收货人姓名',
    },
  ],
  region: [
    {
      required: true,
      message: '请选择您的位置!',
    },
  ],
  detailAddress: [
    {
      required: true,
      message: '请输入详细地址!',
    },
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号!',
      validator: validatePhone,
    },
  ],
}
watch(
  () => state.model.province,
  (newValue) => {
    if (newValue) {
      state.model.fullArea = [state.model.provinceId, state.model.cityId, state.model.districtId]
      state.model.region = `${state.model.province}-${state.model.city}-${state.model.district}`
    }
  },
  {
    deep: true,
  }
)

watch(
  () => [state.model.provinceId, state.model.cityId, state.model.districtId],
  ([provinceId, cityId, districtId]) => {
    if (provinceId && cityId && districtId) {
      state.model.fullArea = [provinceId, cityId, districtId]
      state.model.region = `${state.model.province}-${state.model.city}-${state.model.district}`
      // console.log(state.model)
    }
  }
)

/** ***ref、reactive、props，等……end*****/
// const onSubmit = (values) => {
//   console.log('Success:', values)
// }

const onFailed = (errorInfo) => {
  console.log('failed', errorInfo)
}

const onConfirm = ({ selectedOptions }) => {
  // values 是一个数组，包含省、市、区对象
  const [province, city, district] = selectedOptions
  // console.log(province)
  state.model.region = `${province.text} ${city.text} ${district.text}`

  // 如果还要存 ID，可以写到 state.model
  state.model = {
    ...state.model,
    province: province.text,
    city: city.text,
    district: district.text,
    provinceId: province.value,
    cityId: city.value,
    districtId: district.value,
  }

  state.showRegion = false
}

const onSubmit = async (values) => {
  try {
    let res = null
    const params = { ...state.model }
    params.isDefault = params.is_default ? 1 : 0
    if (state.model.id) {
      res = await updateAddressApi(params)
    } else {
      res = await createAddressApi(params)
    }

    if (res.code == 200) {
      router.back()
    } else {
      customToast(res.msg)
    }
  } catch (error) {
    // 捕获异常
    console.error(error)
  }
}
const transformToAreaList = (data) => {
  const areaList = {
    province_list: {},
    city_list: {},
    county_list: {},
  }

  data.forEach((province) => {
    // 判断是否是直辖市
    if (['11', '12', '31', '50'].includes(String(province.id))) {
      const provinceCode = String(province.id).padEnd(6, '0') // 11 -> 110000
      areaList.province_list[provinceCode] = province.name

      // 补一个市级节点
      const cityCode = provinceCode.slice(0, 3) + '100' // 110100
      areaList.city_list[cityCode] = province.name

      // 区县直接挂在 province.children[0].children
      const districts = province.children?.[0]?.children || []
      districts.forEach((district) => {
        areaList.county_list[district.id] = district.name
      })
    } else {
      // 普通省份
      const provinceCode = String(province.id).padEnd(6, '0')
      areaList.province_list[provinceCode] = province.name

      province.children?.forEach((city) => {
        areaList.city_list[city.id] = city.name
        city.children?.forEach((district) => {
          areaList.county_list[district.id] = district.name
        })
      })
    }
  })

  return areaList
}
const getAreaData = async () => {
  try {
    if (!getAreaHistory('areaData')) {
      const { data } = await areaApi()
      if (data && data.length > 0) {
        state.areaList = transformToAreaList(data)
        setAreaHistory(state.areaList)
      }
    } else {
      state.areaList = getAreaHistory('areaData')
    }
  } catch (error) {
    // 捕获异常
    console.error(error)
  }
}
/** ***函数 start*****/

/** ***函数 end*****/

/** ***生命周期start*****/
onMounted(async () => {
  getAreaData()

  if (route.query.id) {
    try {
      loading.value = true
      const { data } = await addressDetailApi(route.query.id)
      Object.assign(state.model, data)

      state.model.is_default = data.isDefault ? true : false
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }
})
/** ***生命周期end*****/
</script>

<style scoped lang="less">
.address-detail {
  width: 100%;
  height: 100%;
  background: #f6f6f6;
  //   height: 100%;
  //   overflow-y: scroll;
  .address-form {
    // margin: 16px;
    // padding: 0 15px;
    // border-radius: 10px;
    // border: 1px solid #f4f4f4;
    background: #fff;

    :deep(.van-form) {
      .van-cell-group--inset {
        margin: 0 !important;

        .van-cell {
          // height: 36px;
          line-height: 36px;
        }

        .switch {
          display: flex;
          justify-content: space-between;
          .van-field__label {
            flex: 1;
          }
          .van-cell__value {
            flex: 0;
          }
        }
      }
    }

    .save {
      width: 100%;
      position: fixed;
      left: 0;
      bottom: 0;
      flex-wrap: wrap;
      background: #fff;
      border: 0;

      padding: 10px;
      height: 70px;
      border-radius: 0;

      :deep(.van-button__text) {
        border-radius: 24px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        width: 100%;
        background: linear-gradient(90deg, var(--color-light), rgba(255, 96, 0, 0.6));
        margin-bottom: 10px;
        box-shadow: 0 2.8px 7px rgba(255, 96, 0, 0.45);
      }
    }
  }
}
</style>
