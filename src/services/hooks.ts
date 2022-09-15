import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { BASE_URL } from './common'
import { ApiEndpoint, StatusCode } from '../types/enum'
import { universalGetRequestWithParams } from './RequestHandler'

const useProviderBankCodeTypeList = () => {
  const [providerBankCodeTypeList, setProviderBankCodeTypeList] = useState([] as string[])

  const { loginData } = useSelector((state: any) => state.user)

  useEffect(() => {
    const getUserProfile = async () => {
      const url = `${BASE_URL}/${ApiEndpoint.GET_PARAMETER}`
      const response: any = await universalGetRequestWithParams(url, { param_name: 'bank_code_type' })

      if (response.status === StatusCode.OKAY) {
        setProviderBankCodeTypeList(response.data.data.map((o: { value: string }) => o.value))
      }
    }

    getUserProfile()
  }, [loginData])

  return providerBankCodeTypeList
}

export default useProviderBankCodeTypeList
