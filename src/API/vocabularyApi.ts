import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Vocabulary } from '../components/Types';


const vocabularyApi = createApi({
    reducerPath: 'vocabularyApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
    tagTypes: ['vocabulary'],
    endpoints: builder => ({
        getVocabulary: builder.query<Vocabulary, number | undefined>({
            query: (id) => 'vocabularies/' + id,
            providesTags: result => ['vocabulary']
        }),
        updateVocabulary: builder.mutation({
            query: ({ id, data }: { id: number; data: Vocabulary }) => {
                return ({
                    url: 'vocabularies/' + id,
                    method: 'PUT',
                    body: data
                })
            },
            async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {              //  Optimistic Updates
                const putResult = dispatch(
                    vocabularyApi.util.updateQueryData('getVocabulary', id, (draft) => {
                        Object.assign(draft, data)
                    })
                )
                try {
                    await queryFulfilled
                } catch {
                    putResult.undo()
                }
            },
        }),
        createVocabulary: builder.mutation({
            query: (name: string) =>
            ({
                url: 'vocabularies',
                method: 'POST',
                body: {
                    name,
                    vocabulary: []
                }
            })
        }),
        removeVocabulary: builder.mutation({
            query: (id: number) =>
            ({
                url: 'vocabularies/' + id,
                method: 'DELETE',
            })
        }),
        updateVocabularyName: builder.mutation({
            query: ({ id, name }: { id: number, name: string }) =>
            ({
                url: 'vocabularies/' + id,
                method: 'PATCH',
                body: { name }
            })
        })
    })
})

export const {
    useGetVocabularyQuery,
    useLazyGetVocabularyQuery,
    useUpdateVocabularyMutation,
    useCreateVocabularyMutation,
    useRemoveVocabularyMutation,
    useUpdateVocabularyNameMutation,

} = vocabularyApi;

export default vocabularyApi;