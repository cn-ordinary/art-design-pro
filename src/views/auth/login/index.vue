<template>
  <div class="login">
    <!-- 背景图 -->
    <div class="login-bg">
      <img src="@/assets/img/login/assets-login-bg-white-439b0654.avif" alt="登录背景" />
    </div>

    <!-- 左侧登录表单 -->
    <div class="left-wrap">
      <div class="login-wrap">
        <div class="form">
          <div class="header">
            <ArtLogo class="icon" />
            <h1>{{ $t('login.title') }}</h1>
          </div>
          <h3 class="title">{{ systemName }}</h3>
          <!-- <p class="sub-title">{{ $t('login.subTitle') }}</p> -->
          <ElForm
            ref="formRef"
            :model="formData"
            :rules="rules"
            @keyup.enter="handleSubmit"
            style="margin-top: 25px"
          >
            <ElFormItem prop="username">
              <ElInput :placeholder="$t('login.placeholder[0]')" v-model.trim="formData.username" />
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput
                :placeholder="$t('login.placeholder[1]')"
                v-model.trim="formData.password"
                type="password"
                radius="8px"
                autocomplete="off"
                show-password
              />
            </ElFormItem>

            <ElFormItem prop="captchaCode">
              <div class="captcha-container">
                <ElInput
                  :placeholder="$t('login.placeholder[2]')"
                  v-model.trim="formData.captchaCode"
                  type="text"
                  radius="8px"
                  autocomplete="off"
                />
                <img class="captcha-img" :src="captchaBase64Image" @click="getCaptcha" alt="" />
              </div>
            </ElFormItem>

            <!-- 记住密码，暂未实现 -->
            <div class="forget-password">
              <ElCheckbox>{{ $t('login.rememberPwd') }}</ElCheckbox>
              <RouterLink :to="RoutesAlias.ForgetPassword">{{ $t('login.forgetPwd') }}</RouterLink>
            </div>

            <div style="margin-top: 30px">
              <ElButton
                class="login-btn"
                type="primary"
                @click="handleSubmit"
                :loading="loading"
                v-ripple
              >
                {{ $t('login.btnText') }}
              </ElButton>
            </div>

            <div class="footer">
              <p>
                {{ $t('login.noAccount') }}
                <RouterLink :to="RoutesAlias.Register">{{ $t('login.register') }}</RouterLink>
              </p>
            </div>
          </ElForm>
        </div>
      </div>
    </div>

    <!-- 右侧控制按钮 -->
    <div class="right-wrap">
      <div class="top-right-wrap">
        <div class="btn theme-btn" @click="toggleTheme">
          <i class="iconfont-sys">
            {{ isDark ? '&#xe6b5;' : '&#xe725;' }}
          </i>
        </div>
        <ElDropdown @command="changeLanguage" popper-class="langDropDownStyle">
          <div class="btn language-btn">
            <i class="iconfont-sys icon-language">&#xe611;</i>
          </div>
          <template #dropdown>
            <ElDropdownMenu>
              <div v-for="lang in languageOptions" :key="lang.value" class="lang-btn-item">
                <ElDropdownItem
                  :command="lang.value"
                  :disabled="lang.disabled"
                  :class="{ 'is-selected': locale === lang.value }"
                >
                  <span class="menu-txt">{{ lang.label }}</span>
                  <i v-if="locale === lang.value" class="iconfont-sys icon-check">&#xe621;</i>
                </ElDropdownItem>
              </div>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { LanguageEnum, SystemThemeEnum } from '@/enums/appEnum'
  import { LoginTypeEnum } from '@/enums/auth'
  import { languageOptions } from '@/locales'
  import { RoutesAlias } from '@/router/routesAlias'
  import { useUserStore } from '@/store/modules/user'
  import { HttpError } from '@/utils/http/error'
  import { ElMessage, ElNotification } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  // 切换主题
  import { AuthService } from '@/api/auth-api'
  import { AccountService } from '@/api/account-api'
  import { useTheme } from '@/composables/useTheme'
  import { useSettingStore } from '@/store/modules/setting'
  import type { FormInstance, FormRules } from 'element-plus'

  defineOptions({ name: 'Login' })

  const { t } = useI18n()

  type AccountKey = 'super-admin' | 'guest-user'

  export interface Account {
    userName: string
    password: string
    captchaId: string
    captchaCode: string
    loginType: LoginTypeEnum
  }

  const captchaBase64Image = ref('')

  const accounts = computed<Account[]>(() => [
    {
      userName: 'super-admin',
      password: '123456',
      captchaId: '',
      captchaCode: '',
      loginType: LoginTypeEnum.PASSWORD_LOGIN
    },
    {
      userName: 'guest-user',
      password: '123456',
      captchaId: '',
      captchaCode: '',
      loginType: LoginTypeEnum.PASSWORD_LOGIN
    }
  ])

  const settingStore = useSettingStore()
  const { isDark, systemThemeType } = storeToRefs(settingStore)

  const userStore = useUserStore()
  const router = useRouter()

  const systemName = AppConfig.systemInfo.name
  const formRef = ref<FormInstance>()

  const formData = reactive({
    username: '',
    password: '',
    captchaId: '',
    captchaCode: '',
    loginType: LoginTypeEnum.PASSWORD_LOGIN
  })

  const rules = computed<FormRules>(() => ({
    username: [{ required: true, message: t('login.placeholder[0]'), trigger: 'blur' }],
    password: [{ required: true, message: t('login.placeholder[1]'), trigger: 'blur' }],
    captchaCode: [{ required: true, message: t('login.placeholder[2]'), trigger: 'blur' }]
  }))

  const loading = ref(false)

  onMounted(() => {
    setupAccount('super-admin')
    getCaptcha()
  })

  async function getCaptcha() {
    try {
      const captchaRes = await AuthService.fetchCaptcha()
      captchaBase64Image.value = captchaRes.captchaBase64Image
      formData.captchaId = captchaRes.captchaId
      // 判断当前环境，自动填充验证码
      if (import.meta.env.DEV) {
        formData.captchaCode = captchaRes.captchaCode || ''
      } else {
        formData.captchaCode = ''
      }
      // beginRefreshCaptchaInterval(captchaRes.expireSeconds)
    } catch (e) {
      console.log(e)
    }
  }

  // // 修改定义处的类型为 number | null
  // const refreshCaptchaInterval = ref<number | null>(null)

  // // 开始刷新验证码的定时器
  // function beginRefreshCaptchaInterval(expireSeconds: number) {
  //   if (refreshCaptchaInterval.value === null) {
  //     refreshCaptchaInterval.value = window.setInterval(
  //       () => {
  //         getCaptcha()
  //       },
  //       (expireSeconds - 5) * 1000
  //     )
  //   }
  // }

  // // 停止刷新验证码的定时器
  // function stopRefreshCaptchaInterval() {
  //   if (refreshCaptchaInterval.value !== null) {
  //     window.clearInterval(refreshCaptchaInterval.value)
  //     refreshCaptchaInterval.value = null
  //   }
  // }

  // 设置账号
  const setupAccount = (key: AccountKey) => {
    const selectedAccount = accounts.value.find((account: Account) => account.userName === key)
    formData.username = selectedAccount?.userName ?? ''
    formData.password = selectedAccount?.password ?? ''
  }

  // 登录
  const handleSubmit = async () => {
    if (!formRef.value) return

    try {
      // 表单验证
      const valid = await formRef.value.validate()
      if (!valid) return

      loading.value = true

      // 登录请求
      const accountLoginRes = await AuthService.accountLogin(formData)

      // 存储token和用户信息
      userStore.setToken(accountLoginRes.accessToken, accountLoginRes.refreshToken)

      // 获取用户信息
      const accountDetails = await AccountService.getAccountDetails(undefined)
      userStore.setUserInfo(accountDetails)
      userStore.setLoginStatus(true)

      // 登录成功处理
      // stopRefreshCaptchaInterval()
      showLoginSuccessNotice(accountDetails.nickname)
      await router.push('/')
    } catch (error) {
      // 处理 HttpError
      if (error instanceof HttpError) {
        // console.log(error.code)
      } else {
        // 处理非 HttpError
        ElMessage.error('登录失败，请稍后重试')
        console.error('[Login] Unexpected error:', error)
      }
    } finally {
      loading.value = false
    }
  }

  // 登录成功提示
  const showLoginSuccessNotice = (nickname: string) => {
    setTimeout(() => {
      ElNotification({
        title: t('login.success.title'),
        type: 'success',
        duration: 2500,
        zIndex: 10000,
        message: `${t('login.success.message')}, ${nickname}!`
      })
    }, 150)
  }

  // 切换语言
  const { locale } = useI18n()

  const changeLanguage = (lang: LanguageEnum) => {
    if (locale.value === lang) return
    locale.value = lang
    userStore.setLanguage(lang)
  }

  const toggleTheme = () => {
    let { LIGHT, DARK } = SystemThemeEnum
    useTheme().switchThemeStyles(systemThemeType.value === LIGHT ? DARK : LIGHT)
  }
</script>

<style lang="scss" scoped>
  @use './index';
</style>
