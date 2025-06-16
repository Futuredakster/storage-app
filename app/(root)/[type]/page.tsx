import React from 'react';
import Sort from '@/components/Sort';
import { getFiles } from '@/lib/actions/file.actions';
import { Models } from "node-appwrite";
import Card from '@/components/Card';
import { getFileTypesParams } from '@/lib/utils';
import { convertFileSize } from '@/lib/utils';

const Page = async ({ searchParams,params}:SearchParamProps) => {
    const type =((await params)?.type as string) || "";
    const searchText = ((await searchParams)?.query as string) || "";
    const sort = ((await searchParams)?.sort as string) || "";
    const types= getFileTypesParams(type) as FileType[];

    const files = await getFiles({types,searchText,sort});
  const totalSize = files.documents.reduce((acc: number, file: Models.Document) => {
  return acc + (file.size as number);
}, 0);

const formattedSize = convertFileSize(totalSize);

return (
  <div className='page-container'>
    <section className='w-full'>
      <h1 className='h1 capitalize'>{type}</h1>

      <div className='total-size-section'>
        <p className='body-1'>
          Total: <span className='h5'>{formattedSize}</span>
        </p>

        <div className='sort-container'>
          <p className='body-1 hidden sm:block text-light-200'> Sort by:</p>
          <Sort />
        </div>
      </div>
    </section>

    {files.total > 0 ? (
      <section className='file-list'>
        {files.documents.map((file: Models.Document) => (
          <Card key={file.$id} file={file} />
        ))}
      </section>
    ) : (
      <p className='empty-list'>No Files Uploaded</p>
    )}
  </div>
);
};
export default Page;
