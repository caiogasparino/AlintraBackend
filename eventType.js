import { Type } from 'avsc';

const newsSchema = {
  type: 'record',
  fields: [
    {
      name: 'id',
      type: 'string',
    },
    {
      name: 'type',
      type: 'string',
    },
    {
      name: 'title',
      type: 'string',
    },
    {
      name: 'introduction',
      type: 'string',
    },
    {
      name: 'publication_date',
      type: 'string',
    },
    {
      name: 'product_id',
      type: 'string',
    },
    {
      name: 'products',
      type: 'string',
    },
    {
      name: 'editorial_sections',
      type: 'string',
    },
    {
      name: 'images',
      type: 'string',
    },
    {
      name: 'related_products',
      type: 'string',
    },
    {
      name: 'highlight',
      type: 'boolean',
    },
    {
      name: 'link',
      type: 'string',
    },
  ],
};

const newsType = Type.forSchema(newsSchema);

export default newsType;
