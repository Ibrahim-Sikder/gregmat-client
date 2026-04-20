import RichText from "./RichText";

interface PlanSectionsProps {
  data: any;
  showSections: boolean;
}

const PlanSections = ({ data, showSections }: PlanSectionsProps) => {
  if (!showSections || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  return (
    <div className="space-y-10">
      {data.map((section: any) => (
        <div key={section._id} className="border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
          <p className="text-gray-600 mb-4">{section.description}</p>

          {section.units?.length > 0 && (
            <div className="space-y-4">
              {section.units.map((unit: any) => (
                <div
                  key={unit._id}
                  className="border rounded-md p-4 bg-gray-50"
                >
                  <h3 className="font-medium">{unit.title}</h3>
                  {unit.description && <RichText html={unit.description} />}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlanSections;
