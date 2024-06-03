import { useQuery, useMutation } from '@tanstack/react-query';
import { axiosInstanceToken } from '../axiosInstance';
import { END_POINT } from '@/constants/';
import useGetCookie from '@/hooks/useCookies';

// 로그인한 유저의 프로필 정보 가져오는 API
export function useGetProfile() {
  const { getCookie } = useGetCookie();
  const accessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM2LCJ0ZWFtSWQiOiI0LTE2IiwiaWF0IjoxNzE3NDMxODQ0LCJleHAiOjE3MTc0MzM2NDQsImlzcyI6InNwLWdsb2JhbG5vbWFkIn0.gK2jGg3ltrcCR35boHJzMk4LyoTrx_8rsDDuOx66CBA';

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!accessToken) throw new Error('Access token is not available');
      const { data } = await axiosInstanceToken(accessToken).get(`${END_POINT.USERS}/me`);
      return data;
    },
  });
}

// 유저 프로필 이미지 저장
export function useUploadProfileImage() {
  const { getCookie } = useGetCookie();

  return useMutation({
    mutationFn: async (file: File) => {
      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM2LCJ0ZWFtSWQiOiI0LTE2IiwiaWF0IjoxNzE3NDMxODQ0LCJleHAiOjE3MTc0MzM2NDQsImlzcyI6InNwLWdsb2JhbG5vbWFkIn0.gK2jGg3ltrcCR35boHJzMk4LyoTrx_8rsDDuOx66CBA';

      if (!accessToken) throw new Error('Access token is not available');

      const formData = new FormData();
      formData.append('image', file);

      const { data } = await axiosInstanceToken(accessToken).post(`${END_POINT.USERS}/me/image`, formData);

      return data.profileImageUrl;
    },
  });
}

// 유저의 프로필 정보를 수정하는 API
export interface usePatchProfileProps {
  nickname?: string;
  newPassword?: string;
  profileImageUrl?: string;
}

export function usePatchProfile() {
  const { getCookie } = useGetCookie();

  return useMutation({
    mutationFn: async (bodyData: usePatchProfileProps) => {
      const accessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzM2LCJ0ZWFtSWQiOiI0LTE2IiwiaWF0IjoxNzE3NDMxODQ0LCJleHAiOjE3MTc0MzM2NDQsImlzcyI6InNwLWdsb2JhbG5vbWFkIn0.gK2jGg3ltrcCR35boHJzMk4LyoTrx_8rsDDuOx66CBA';

      if (!accessToken) throw new Error('Access token is not available');
      const { data } = await axiosInstanceToken(accessToken).patch(`${END_POINT.USERS}/me`, bodyData);
      return data;
    },
  });
}
