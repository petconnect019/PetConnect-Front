import addTag from '../../assets/addTag.png'
import { useNavigate } from 'react-router-dom';

export const AddTagContainer = ({petId}) => {
const navigate = useNavigate();

    return (
      <div onClick={()=>navigate(`/scanner/${petId}`)} className="flex items-center justify-center bg-[#F8FAFC] border-none rounded-lg shadow-lg">
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