import HomePreview from 'cms/previews/HomePreview';
import PostPreview from 'cms/previews/PostPreview';
import Spinner from 'components/icons/Spinner';
import config from 'cms/config';
import dynamic from 'next/dynamic';

const CMS = dynamic(
  (): any =>
    import('netlify-cms-app').then((cms: any) => {
      cms.init({ config });
      cms.registerPreviewStyle(
        'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'
      );
      cms.registerPreviewStyle(
        'https://unpkg.com/@tailwindcss/typography@0.2.x/dist/typography.min.css'
      );
      cms.registerPreviewTemplate('home', HomePreview);
      cms.registerPreviewTemplate('posts', PostPreview);
    }),
  {
    ssr: false,
    // eslint-disable-next-line react/display-name
    loading: () => <Spinner width="30" className="m-auto mt-6 animate-spin" />,
  }
);

const CMSPage: React.FC = () => {
  return <CMS />;
};

export default CMSPage;
