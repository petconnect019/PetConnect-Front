import addTag from '../../assets/addTag.png'

export const AddTagContainer = () => {
    return (
      <div className="flex items-center justify-center bg-[#F8FAFC] border-none rounded-lg shadow-lg">
        <div className="flex items-center justify-center w-full h-full">
          <img 
            src={addTag} 
            alt={'tag'} 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    );
  };