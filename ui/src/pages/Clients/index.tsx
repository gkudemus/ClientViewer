import { memo, useContext, useEffect, useState } from "react";
import { Paper, Typography, Button, Pagination, createTheme} from "@mui/material";
import { makeStyles, ThemeProvider } from '@mui/styles';
import { StateContext } from "../../store/DataProvider";
import Page from "../../components/Page";
import ClientTable from "./ClientTable";
import SearchBar from "./SearchBar";
import ClientTwoStepForm from "./ClientTwoStepForm";
import { getClients } from "../../services/api";

const theme = createTheme({
});

const useStyles = makeStyles((theme) => ({
  paginator: {
    paddingTop: '10px',
    height: '40px'
  },
  modalPaper: {
    display: 'flex', 
    justifyContent: 'space-between', 
    padding: '10px'
  },
  contentContainerPaper: {
    margin: "auto", 
    minWidth: '500px',
    maxWidth: '1400px'
  },
  headerTitle: {
    textAlign: "start",
    padding: '10px'
  },
  button: {
    fontSize: 'xx-small',
    padding: '12px',
  },
}));

function Clients() {
  const { state, dispatch } = useContext(StateContext);
  const { clients } = state;
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('')
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getClients().then((clients) =>
      dispatch({ type: "FETCH_ALL_CLIENTS", data: clients })
    );
    setIsDataUpdated(false)
  }, [dispatch, isDataUpdated]);


  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  };

  const filteredData = clients.filter((client) =>
  client.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  client.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDataForPage = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredData.length);
    return filteredData.slice(startIndex, endIndex);
  };

  const paginatedData = getDataForPage();
  
  return (
    <ThemeProvider theme={theme}>
      <Page>
        <Typography variant="h4" className={classes.headerTitle}>
          Clients
        </Typography>
        <Paper className={classes.contentContainerPaper}>
          <Paper className={classes.modalPaper}>
            <SearchBar onSearch={handleSearch} />
            <Button variant="contained" color="primary" onClick={handleOpen} className={classes.button}>Create New Client</Button>
          </Paper>
          <ClientTable clients={paginatedData} />
          <Pagination
            count={Math.ceil(filteredData.length / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            className={classes.paginator}
          />
        </Paper>      
        <ClientTwoStepForm open={open} onClose={handleClose} setIsDataUpdated={setIsDataUpdated}/>
      </Page>
    </ThemeProvider>    
  );
}

export default memo(Clients);
