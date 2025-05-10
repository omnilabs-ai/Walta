interface TechnicalSectionProps {
    scrollY: number;
  }
  
  const TechnicalSection = ({ scrollY }: TechnicalSectionProps) => {
    return (
      <div className="mt-20 px-4">
        <div className={`transition-all duration-700 ease-in-out transform ${
          scrollY > 900 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}>
          
        </div>
      </div>
    );
  };
  
  export default TechnicalSection;