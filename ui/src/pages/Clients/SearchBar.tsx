import { SetStateAction } from 'react';
import TextField from '@mui/material/TextField';

const SearchBar = ({ onSearch } : {onSearch: any}) => {

  const handleInputChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    const searchString = e.target.value
    onSearch(searchString);
  };

  return (
    <TextField
      label="Search"
      variant="outlined"
      fullWidth
      onChange={handleInputChange}
      size='small'
      style={{width: '230px'}}
    />
  );
};

export default SearchBar;