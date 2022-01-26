import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Vocabulary, Word } from '../components/Types';


const vocabularyApi = createApi({
    reducerPath: 'vocabularyApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
    tagTypes: ['vocabulary'],
    endpoints: (builer) => ({
        getVocabulary: builer.query<Vocabulary, any>({
            query: (id:number) => 'vocabularies/' + id,
            providesTags: result => ['vocabulary']
        }),
        updateVocabulary: builer.mutation({
            query: ({id, data}: {id: number; data: Vocabulary}) =>
            {
                return ({
                url: 'vocabularies/' + id,
                method: 'PUT',
                body: data
            })},
            invalidatesTags: result => ['vocabulary']
        })
    })
})

export const { useLazyGetVocabularyQuery, useUpdateVocabularyMutation } = vocabularyApi;

export default vocabularyApi;