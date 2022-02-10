import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Configurations, Topic } from '../components/Types';
import { setErrorMessage } from '../helpers/fucntionsHelp';

const configApi = createApi({
    reducerPath: 'configApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
    tagTypes: ['config'],
    endpoints: (builer) => ({
        getConfig: builer.query<Configurations, void | undefined>({
            query: () => 'configuration',
            providesTags: ['config']
        }),
        updateConfig: builer.mutation<Configurations, Configurations>({
            query: (config) =>
            ({
                url: 'configuration',
                method: 'PUT',
                body: config
            }),
            async onQueryStarted(config, { dispatch, queryFulfilled }) {        // Optimistic Updates:
                const patchResult = dispatch(
                    configApi.util.updateQueryData('getConfig', undefined, (draft) => {
                        Object.assign(draft, config)
                    })
                )
                try {
                    await queryFulfilled
                } catch (e: any) {
                    patchResult.undo();
                    dispatch(setErrorMessage(e.error, 'changeConfig'))
                }
            },
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
                url: 'configuration',
                method: 'PATCH',
                body: { theme: color }
            }),
            // Optimistic Updates:
            async onQueryStarted(color, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    configApi.util.updateQueryData('getConfig', undefined, (draft) => {
                        Object.assign(draft, { theme: color })
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
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