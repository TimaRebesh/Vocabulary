import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Configurations } from '../components/Types';

const configApi = createApi({
    reducerPath: 'configApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
    tagTypes: ['config'],
    endpoints: (builer) => ({
        getConfig: builer.query<Configurations, any>({
            query: () => 'configuration',
            providesTags: result => ['config']
        }),
        updateConfig: builer.mutation({
            query: (config) =>
            ({
                url: 'configuration',
                method: 'PUT',
                body: config
            }),
            invalidatesTags: result => ['config']
        }),
        changeTopic: builer.mutation({
            query: (id:number) => 
            ({
                url: 'configuration',
                method: 'PATCH',
                body: {studyID: id}
            }),
            invalidatesTags: result => ['config']
        })
    })
})

export const { useGetConfigQuery, useUpdateConfigMutation, useChangeTopicMutation } = configApi;

export default configApi;