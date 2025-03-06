import React, { useState } from 'react';
import { SketchPicker } from 'react-color';
import * as d3 from "d3";
import { styled } from '@mui/material/styles';
import {
    Experimental_CssVarsProvider as CssVarsProvider,
    experimental_extendTheme as extendTheme,
    useColorScheme,
    useTheme,
} from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Box from "@mui/material/Box";
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import GitHubSvg from './github.svg';

import Dashboard from "./components/Dashboard"
import FileUpload from "./components/FileUpload"

import "./styles.css"

import { useChartsContext } from "./providers/ChartsProvider"
import { useDataContext, chartsAvailable, fieldsAvailable, summarizationAvailable } from "./providers/DataProvider"

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginRight: -drawerWidth,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginRight: -drawerWidth,
        }),
    }),
);

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: drawerWidth,
    }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
}));

const getThemeExtender = (color) => {
    const theme = extendTheme({
        colorSchemes: {
            light: {
                palette: {
                    primary: {
                        main: color,
                        contrastText: "#f8f9fa",
                    },
                    background: {
                        default: "#eceff1",
                        primary: "#eceff1",
                    },
                    divider: color,
                },
            }
        }
    })

    return theme
}

const App = (props) => {
    const { charts, addChart, replaceChart, removeChart, removeLastChart, updateChart } = useChartsContext()
    const { setChosenChartIndex } = useDataContext()
    const [theme, setTheme] = useState(getThemeExtender('#2196f3'))
    const [colorPickerVisible, setColorPickerVisible] = useState(false)
    const [selectedColor, setSelectedColor] = useState('#2196f3')

    const handleThemeChange = (color) => {
        setSelectedColor(color.hex)
        setTheme(getThemeExtender(color.hex))
    }

    const [open, setOpen] = useState(false)
    const [selectedChartIndex, setSelectedChartIndex] = useState(null)
    const [selectedChartType, setSelectedChartType] = useState(null)

    const handleDrawerOpen = (chart, index) => {
        setSelectedChartType(chart.type)
        setSelectedChartIndex(index)
        setOpen(true);
        document.body.classList.add("open")
        document.body.classList.remove("closed")
    }

    const handleDrawerClose = () => {
        setSelectedChartType(null)
        setSelectedChartIndex(null)
        setOpen(false);
        document.body.classList.add("closed")
        document.body.classList.remove("open")

        setChosenChartIndex(null)
    }

    const handleRemoveSelectedChart = () => {
        setSelectedChartType(null)
        removeChart(selectedChartIndex)
    }

    const handleReplaceChart = (event) => {
        setSelectedChartType(event.target.value)
        replaceChart(selectedChartIndex, event.target.value)
    }

    return (
        <CssVarsProvider theme={theme}>
            <CssBaseline />
            <div className="App">
                <AppBar position="fixed" open={open} style={{ backgroundColor: open ? "#D0D2D4" : null }}>
                    <Toolbar className="close_me">
                        <Typography className="close_me" variant="h6" noWrap sx={{ flexGrow: 1 }} component="div" style={{ color: open && "mode" === "dark" ? '#8B8E91' : '' }}>
                            LLM Dashboard Builder
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                    </Toolbar>
                </AppBar>
                <Main open={open}>
                    <DrawerHeader className="close_me" />
                    <Box sx={{ flexGrow: 1 }} className="close_me">
                        <FileUpload />
                        <Grid container spacing={2} className="containerOnDesktop">
                            <Grid xs={8} className="gridOnDesktop__left close_me">
                                <ButtonGroup variant="contained" aria-label="outlined primary button group" className="close_me">
                                    <Button disabled={open} onClick={addChart}>Add New Chart</Button>
                                    <Button disabled={open || (charts.length === 0)} onClick={removeLastChart}>Remove Last Chart</Button>
                                </ButtonGroup>
                            </Grid>
                            <Grid xs={4} className="gridOnDesktop__right close_me" justifyContent="right" alignItems="right">
                                <div className="textright close_me">
                                    <Button onClick={() => setColorPickerVisible(!colorPickerVisible)}>
                                        Change theme color
                                    </Button>
                                    {colorPickerVisible && (
                                        <div style={{ position: 'absolute', zIndex: 2 }}>
                                            <SketchPicker
                                                color={selectedColor}
                                                onChangeComplete={handleThemeChange}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                    <Dashboard
                        opened={open}
                        handleDrawerOpen={handleDrawerOpen}
                        handleDrawerClose={handleDrawerClose} />
                </Main>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        position: 'absolute',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                        },
                    }}
                    variant="persistent"
                    anchor="right"
                    open={open}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>

                    <FormControl fullWidth>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            className="config__select"
                            value={selectedChartType}
                            onChange={handleReplaceChart}
                        >
                            {chartsAvailable
                                .map((chart) => (
                                    <MenuItem value={chart.type}>{chart.name}</MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    {chartsAvailable
                        .filter(chart => chart.type === selectedChartType)
                        .map(chart => (
                            Object.keys(chart)
                                .filter((keyName, i) => keyName !== 'type' && keyName !== 'name' && chart[keyName] !== null)
                                .map((keyName, i) => (
                                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                        <InputLabel id={`demo-simple-select-helper-label-${keyName}`}>{keyName}</InputLabel>
                                        <Select
                                            labelId={`demo-simple-select-helper-label-${keyName}`}
                                            id={`demo-simple-select-helper-${keyName}`}
                                            value={charts.filter((chart, index) => index === selectedChartIndex)[0][keyName]}
                                            label={keyName}
                                            onChange={(e) => updateChart(selectedChartIndex, keyName, e.target.value)}
                                        >
                                            {!keyName.includes('Summarization') ?
                                                fieldsAvailable
                                                    .map(field => (
                                                        <MenuItem value={field.id}>{field.name}</MenuItem>
                                                    ))
                                                :
                                                summarizationAvailable
                                                    .filter(
                                                        summarization => summarization.numberOnly === false ||
                                                            (
                                                                fieldsAvailable.filter(field => field.id === charts.filter((chart, index) => index === selectedChartIndex)[0][keyName.replace('Summarization', '')])[0] !== undefined &&
                                                                fieldsAvailable.filter(field => field.id === charts.filter((chart, index) => index === selectedChartIndex)[0][keyName.replace('Summarization', '')])[0].type === 'number'
                                                            )
                                                    )
                                                    .map(summarization => (
                                                        <MenuItem value={summarization.id}>{summarization.name}</MenuItem>
                                                    ))
                                            }
                                        </Select>
                                    </FormControl>
                                ))
                        ))}

                    <Divider className="config__divider" />

                    <Button variant="contained" className="config__button close_me" onClick={handleRemoveSelectedChart}>Remove Chart</Button>
                </Drawer>
            </div>
        </CssVarsProvider>
    );
}

export default App;