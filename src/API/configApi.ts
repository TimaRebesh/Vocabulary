import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Configurations, Topic } from '../components/Types';

const configApi = createApi({
    reducerPath: 'configApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
    tagTypes: ['config'],
    endpoints: (builer) => ({
        getConfig: builer.query<Configurations, void>({
            query: (value) => 'configuration',
            providesTags: ['config']
        }),
        updateConfig: builer.mutation({
            query: (config) =>
            ({
                url: 'configuration',
                method: 'PUT',
                body: config
            }),
            invalidatesTags: ['config']
        }),
        changeTopic: builer.mutation({
            query: (id: number) =>
            ({
                url: 'configuration',
                method: 'PATCH',
                body: { studyID: id }
            }),
            invalidatesTags: ['config'],
        }),
        changeTheme: builer.mutation({
            query: (color: string) =>
            ({
                url: 'configuration ',
                method: 'PATCH',
                body: { theme: color }
            }),
            invalidatesTags: ['config']
        }),
        updateVocsInConfig: builer.mutation({
            query: (vocabularies: Topic[]) =>
            ({
                url: 'configuration',
                method: 'PATCH',
                body: { vocabularies }
            }),
            invalidatesTags: ['config']
        }),
    })
})

export const {
    useGetConfigQuery,
    useUpdateConfigMutation,
    useChangeTopicMutation,
    useChangeThemeMutation,
    useUpdateVocsInConfigMutation
} = configApi;

export default configApi;