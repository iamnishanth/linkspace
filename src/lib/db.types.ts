export type ImageProperties = {
  url: string;
  alt: string;
  width: number;
  height: number;
  fileName: string;
};

export type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

export type BaseLink = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  notes: string;
  created_at: Timestamp;
  updated_at: Timestamp;
  user_id: string;
  space_ids: string[];
};

export type LinkProp = BaseLink & {
  type: "link";
  url: string;
  domain: string;
  image: ImageProperties | null;
};

export type ImageProp = BaseLink & {
  type: "image";
  url: string | null;
  domain: string | null;
  image: ImageProperties;
};

export type TextProp = BaseLink & {
  type: "text";
  content: string;
};

export type Link = LinkProp | ImageProp | TextProp;

export type Space = {
  id: string;
  name: string;
  user_id: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};
