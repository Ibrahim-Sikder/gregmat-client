interface Props {
  text: string;
}

export default function ShowWritingPrompt({ text }: Props) {
  return <div className="prose max-w-none mb-6" dangerouslySetInnerHTML={{ __html: text }} />;
}
