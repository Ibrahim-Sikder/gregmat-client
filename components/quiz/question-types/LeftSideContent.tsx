import { Viewer } from 'react-latex-editor';

interface Props {
  content: string;
}
export default function LeftSideContent({ content }: Props) {
  return (
    <div className="overflow-auto">
      <Viewer contentClassName='viewer-font-size-2xl' content={content} enableMath />
    </div>
  );
}
