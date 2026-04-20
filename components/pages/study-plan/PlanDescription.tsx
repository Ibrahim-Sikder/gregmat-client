interface PlanDescriptionProps {
  data: any;
  showDescription: boolean;
}

const PlanDescription = ({ data, showDescription }: PlanDescriptionProps) => {
  if (!showDescription || !data?.description) return null;

  return (
    <div className="mb-8">
      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: data.description }}
      />
    </div>
  );
};

export default PlanDescription;
