import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Word } from '../components/Types';


const vocabularyApi = createApi({
    reducerPath: 'vocabularyApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/' }),
    tagTypes: ['vocabulary'],
    endpoints: (builer) => ({
        getVocabulary: builer.query<Word[], any>({
            query: (id:number) => id.toString(),
            providesTags: result => ['vocabulary']
        }),
        // updateConfig: builer.mutation({
        //     query: (config) =>
        //     ({
        //         url: 'configuration',
        //         method: 'PUT',
        //         body: config
        //     }),
        //     invalidatesTags: result => ['vocabulary']
        // })
    })
})

export const { useLazyGetVocabularyQuery } = vocabularyApi;

export default vocabularyApi;