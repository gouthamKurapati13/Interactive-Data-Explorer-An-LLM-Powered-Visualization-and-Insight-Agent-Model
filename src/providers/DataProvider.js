import React, { createContext, useContext, useReducer } from 'react';
import * as d3 from 'd3';
import _ from 'lodash';
import rawData from '../../my_weather_data.json';

const DataContext = createContext();
export const useDataContext = () => useContext(DataContext);

export const summarizationAvailable = [
  { id: 'sum', name: 'Sum', numberOnly: true },
  { id: 'average', name: 'Average', numberOnly: true },
  { id: 'min', name: 'Min', numberOnly: true },
  { id: 'max', name: 'Max', numberOnly: true },
  { id: 'distinct', name: 'Count (Distinct)', numberOnly: false },
  { id: 'count', name: 'Count', numberOnly: false },
  { id: 'median', name: 'Median', numberOnly: true },
];

export const chartsAvailable = [
  {
    type: 'scatter',
    name: 'Scatter chart',
    xAxis: 'humidity',
    yAxis: 'temperatureMin',
    yAxisSummarization: null,
    category1: null,
    category2: null,
    category3: null,
    value: null,
    valueSummarization: null,
  },
  {
    type: 'histogram',
    name: 'Column chart',
    xAxis: 'humidity',
    yAxis: 'humidity',
    yAxisSummarization: 'count',
    category1: null,
    category2: null,
    category3: null,
    value: null,
    valueSummarization: null,
  },
  {
    type: 'timeline',
    name: 'Line chart',
    xAxis: 'date',
    yAxis: 'temperatureMin',
    yAxisSummarization: null,
    category1: null,
    category2: null,
    category3: null,
    value: null,
    valueSummarization: null,
  },
  {
    type: 'list',
    name: 'List',
    xAxis: null,
    yAxis: null,
    yAxisSummarization: null,
    category1: 'icon',
    category2: null,
    category3: null,
    value: 'humidity',
    valueSummarization: 'distinct',
  },
];

const typesAndFormats = [
  { id: 'date', format: '%Y-%m-%d', type: 'date' },
  { id: 'time', format: '%s', type: 'time' },
  { id: 'sunriseTime', format: '%s', type: 'time' },
  { id: 'sunsetTime', format: '%s', type: 'time' },
  { id: 'temperatureHighTime', format: '%s', type: 'time' },
  { id: 'temperatureLowTime', format: '%s', type: 'time' },
  { id: 'apparentTemperatureHighTime', format: '%s', type: 'time' },
  { id: 'apparentTemperatureLowTime', format: '%s', type: 'time' },
  { id: 'windGustTime', format: '%s', type: 'time' },
  { id: 'uvIndexTime', format: '%s', type: 'time' },
  { id: 'temperatureMinTime', format: '%s', type: 'time' },
  { id: 'temperatureMaxTime', format: '%s', type: 'time' },
  { id: 'apparentTemperatureMinTime', format: '%s', type: 'time' },
  { id: 'apparentTemperatureMaxTime', format: '%s', type: 'time' },
];

export const fieldsAvailable = Object.keys(rawData[0])
  .filter((id) => !typesAndFormats.find((f) => f.id === id && f.type === 'time')) // todo - add time fields
  .map((id) => ({
    id,
    type: typeof rawData[0][id],
    name: id.charAt(0).toUpperCase() + id.slice(1).replace(/([A-Z])/g, ' $1'),
    ...(typesAndFormats.find((f) => f.id === id)
      ? {
          type: typesAndFormats.find((f) => f.id === id).type
            ? typesAndFormats.find((f) => f.id === id).type
            : typeof rawData[0][id],
          format: typesAndFormats.find((f) => f.id === id).format,
        }
      : {}),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const initialState = {
  selectedChartIndex: null,
  chosenChartIndex: null,
  selectedColumnType: null,
  selectedColumn1: null,
  selectedColumn2: null,
  selectedItem1: null,
  selectedItem2: null,
  selectedFormat1: null,
  selectedFormat2: null,
  data: _.map(rawData, (d) => {
    return {
      ...d,
      highlighted: true,
    };
  }),
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'highlight':
      const formatter = action.format1 ? d3.timeFormat(action.format1) : null;
      return {
        ...state,
        selectedChartIndex: action.chartIndex,
        selectedColumnType: action.columnType,
        selectedColumn1: action.column1,
        selectedColumn2: action.column2,
        selectedItem1: action.item1,
        selectedItem2: action.item2,
        selectedFormat1: action.format1,
        selectedFormat2: action.format2,
        data: _.map(rawData, (d) => {
          return {
            ...d,
            highlighted:
              action.columnType === 'SingleValue'
                ? (action.format1 ? formatter(action.item1) : action.item1) === d[action.column1]
                  ? true
                  : false
                : action.columnType === 'MultipleValues'
                ? d[action.column1] === action.item1 && d[action.column2] === action.item2
                  ? true
                  : false
                : action.columnType === 'BinValues'
                ? d[action.column1] >= d3.min([action.item1, action.item2]) &&
                  d[action.column1] < d3.max([action.item1, action.item2])
                  ? true
                  : false
                : action.columnType === 'LastBinValues'
                ? d[action.column1] >= d3.min([action.item1, action.item2]) &&
                  d[action.column1] <= d3.max([action.item1, action.item2])
                  ? true
                  : false
                : true,
          };
        }),
      };
    case 'choose':
      return {
        ...state,
        chosenChartIndex: action.chosenChartIndex,
      };
    case 'setApiData':
      return {
        ...state,
        summarizationAvailable: action.summarizationAvailable,
        chartsAvailable: action.chartsAvailable,
        typesAndFormats: action.typesAndFormats,
      };
    default:
      return state;
  }
};

const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setApiData = (summarizationAvailable, chartsAvailable, typesAndFormats) => {
    dispatch({ type: 'setApiData', summarizationAvailable, chartsAvailable, typesAndFormats });
  };

  const value = {
    selectedChartIndex: state.selectedChartIndex,
    chosenChartIndex: state.chosenChartIndex,
    selectedColumnType: state.selectedColumnType,
    selectedColumn1: state.selectedColumn1,
    selectedColumn2: state.selectedColumn2,
    selectedItem1: state.selectedItem1,
    selectedItem2: state.selectedItem2,
    selectedFormat1: state.selectedFormat1,
    selectedFormat2: state.selectedFormat2,
    data: state.data,
    setHighlightedData: (chartIndex, columnType, column1, column2, item1, item2, format1, format2) => {
      dispatch({ type: 'highlight', chartIndex, columnType, column1, column2, item1, item2, format1, format2 });
    },
    setChosenChartIndex: (chosenChartIndex) => {
      dispatch({ type: 'choose', chosenChartIndex });
    },
    setApiData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
