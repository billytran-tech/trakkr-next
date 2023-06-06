import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { DatasetController } from 'chart.js';

const Data = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  const data = [
    {
      id: '1000',
      reference: 'EU010620230222',
      asset: 'EURUSD',
      date: '01/06/2023',
      pnl: '+$2200',
      status: 'Win',
      type: 'Long',
    },
    {
      id: '1001',
      reference: 'EU010620230222',
      asset: 'EURUSD',
      date: '01/06/2023',
      pnl: '+$2200',
      status: 'Win',
      type: 'Short',
    },
    {
      id: '1002',
      reference: 'EU010620230222',
      asset: 'EURUSD',
      date: '01/06/2023',
      pnl: '+$2200',
      status: 'Win',
      type: 'Short',
    },
    {
      id: '1003',
      reference: 'EU010620230222',
      asset: 'EURUSD',
      date: '01/06/2023',
      pnl: '+$2200',
      status: 'Win',
      type: 'Short',
    },
    {
      id: '1004',
      reference: 'EU010620230222',
      asset: 'EURUSD',
      date: '01/06/2023',
      pnl: '+$2200',
      status: 'Win',
      type: 'Short',
    },
  ];

  const getSeverity = (product) => {
    switch (product.status) {
      case 'Win':
        return '#3FB8A9';
      case 'Loss':
        return '#FA5757';
      default:
        return null;
    }
  };

  const getSeverityType = (product) => {
    switch (product.type) {
      case 'Long':
        return '#3FB8A9';
      case 'Short':
        return '#FA5757';
      default:
        return null;
    }
  };

  const statusBodyTemplate = (product) => {
    return (
      <Tag
        value={product.status}
        style={{
          backgroundColor: getSeverity(product),
          width: '100%',
        }}
      ></Tag>
    );
  };

  const typeBodyTemplate = (product) => {
    return (
      <Tag
        value={product.type}
        style={{
          backgroundColor: getSeverityType(product),
          width: '100%',
        }}
      ></Tag>
    );
  };

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: [
        '1 Dec',
        '7 Dec',
        '14 Dec',
        '21 Dec',
        '28 Dec',
        '1 Jan',
        '7 Jan',
      ],
      datasets: [
        {
          label: 'PnL',
          data: [12, 51, 62, 33, 21, 62, 45],
          borderColor: '#D955EE',
          tension: 0.4,
          fill: true,
          backgroundColor: (dataset: DatasetController<'line'>) => {
            const ctx = dataset.chart.ctx;

            const gradient = ctx.createLinearGradient(0, 0, 0, 224);
            gradient.addColorStop(0, 'rgba(144, 125, 255, 0.29)');
            gradient.addColorStop(1, 'rgba(214, 214, 214, 0)');

            return gradient;
          },
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'white',
            padding: 10,
            // Include a percentage sign in the ticks
          },
          grid: {
            color: 'white',
            display: false,
          },
          border: { display: false },
        },
        y: {
          ticks: {
            color: 'white',
            callback: function (value, _index, _ticks) {
              return value + ' % ';
            },
          },
          grid: {
            color: surfaceBorder,
            drawTicks: false,
          },
          border: { dash: [5, 5] },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      <div className="flex h-full lg:flex-row flex-col lg:space-x-4 lg:space-y-0 space-y-4">
        <div className="flex flex-col lg:w-[70%] w-full space-y-4">
          <p className="text-white text-3xl text-rounded-[15px]">Trakkr Data</p>
          <div className="flex lg:flex-row flex-col lg:space-x-4 lg:space-y-0 space-y-4 w-full">
            <div className="flex bg-cover text-center lg:text-end place-content-end my-auto bg-[url('/img/stats.svg')] bg-left w-full h-32 rounded-[15px]">
              <div className="w-full flex flex-col mr-6 my-auto align-middle">
                <p className="text-[#B7B7B7] text-md letter font-bold tracking-[0.15rem]">
                  BANKROLL
                </p>
                <p className="text-white text-[34px] font-bold">$23.577</p>
                <p className="w-full place-self-center place-content-center self-center justify-content-center text-center text-md text-[#B7B7B7] mx-auto font-bold">
                  <span
                    className="text-[#14FFE3] rounded-[15px] p-1"
                    style={{ background: 'rgba(12, 255, 226, 0.33)' }}
                  >
                    +30%
                  </span>{' '}
                  from start
                </p>
              </div>
            </div>
            <div className="flex bg-cover text-center lg:text-end place-content-end my-auto bg-[url('/img/stats.svg')] bg-left w-full h-32 rounded-[15px]">
              <div className="w-full flex flex-col mr-8 my-auto align-middle">
                <p className="text-[#B7B7B7] text-md letter font-bold tracking-[0.15rem]">
                  GLOABAL PIN
                </p>
                <p className="text-white text-[34px] font-bold">$223.577</p>
                <p className="w-full place-self-center place-content-center self-center justify-content-center text-center text-md text-[#B7B7B7] mx-auto font-bold">
                  <span
                    className="text-[#14FFE3] rounded-[15px] p-1"
                    style={{ background: 'rgba(12, 255, 226, 0.33)' }}
                  >
                    +30%
                  </span>{' '}
                  from start
                </p>
              </div>
            </div>
            <div className="flex bg-cover text-center lg:text-end place-content-end my-auto bg-[url('/img/stats.svg')] bg-left w-full h-32 rounded-[15px]">
              <div className="w-full flex flex-col mr-8 my-auto align-middle">
                <p className="text-[#B7B7B7] text-md letter font-bold tracking-[0.15rem]">
                  WIN RATE
                </p>
                <p className="text-white text-[34px] font-bold">73,80%</p>
                <p className="w-full text-md text-[#B7B7B7] font-bold">
                  You can still improve
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex text-end place-content-end lg:w-[30%] w-full bg-cover bg-[url('/img/totaltradingtime.svg')] bg-left w-full bg-[#2E3033] rounded-[15px]">
          <div className="w-full h-full flex flex-col mr-8 pt-10 my-auto align-middle">
            <p className="text-[#B7B7B7] text-md letter font-bold tracking-[0.15rem]">
              TOTAL TRADING TIME
            </p>
            <p className="text-white text-[30px] font-bold">417 hours</p>
            <p className="w-full text-md text-[#B7B7B7] font-bold">
              {`that's a good start`}
            </p>
          </div>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col mb-4 h-full lg:space-x-4 lg:space-y-0 space-y-4">
        <div className="flex flex-col h-full lg:w-[70%] w-full space-y-4">
          <div className="flex-col p-4 w-full bg-[#2E3033] h-4/6 rounded-[15px]">
            <p className="text-white text-lg font-bold">
              Profit and losses evolution
            </p>
            <Chart
              className="w-full mt-8"
              type="line"
              data={chartData}
              options={chartOptions}
            />
          </div>
          <div className="flex flex-col w-full bg-[#2E3033] h-2/6 space-y-4 rounded-[15px] py-4 pr-6 pl-4">
            <div className="flex flex-row place-content-between">
              <p className="text-white text-lg align-middle font-bold">
                Latest Trades
              </p>
              <button className="flex flex-row text-center bg-white rounded-2xl px-4 py-2">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  className="mr-2 my-auto"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5479 14.8489L11.4583 12.7594V14.3354H10.0417V10.3333H14.0438V11.75H12.45L14.5396 13.8396L13.5479 14.8489ZM7.20834 5.37499H10.75L7.20834 1.83332V5.37499ZM0.833344 14.5833V0.416656H7.91668L12.1667 4.66666V8.91666H8.62501V14.5833H0.833344Z"
                    fill="black"
                  />
                </svg>
                Export
              </button>
            </div>
            <DataTable
              className="w-full h-full bg-[#2E3033] text-white"
              value={data}
              color="#2E3033"
              rowClassName={() => {
                return {
                  'bg-primary': false,
                };
              }}
              tableClassName="bg-[#2E3033] text-white"
              style={{ background: '#2E3033', borderColor: '#1A1B1E' }}
              tableStyle={{
                width: '100%',
                background: '#2E3033',
              }}
              selectionMode={'checkbox'}
            >
              <Column
                style={{ background: '#2E3033', color: 'white' }}
                selectionMode="multiple"
                headerStyle={{
                  width: '3rem',
                  color: '#B8B8B8',
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
                bodyStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
              />
              <Column
                style={{ background: '#2E3033', color: 'white' }}
                bodyStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
                field="reference"
                header="Reference"
                headerStyle={{
                  color: '#B8B8B8',
                  fontSize: '14px',
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
              ></Column>
              <Column
                style={{ background: '#2E3033', color: 'white' }}
                field="asset"
                header="Asset"
                bodyStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
                headerStyle={{
                  color: '#B8B8B8',
                  fontSize: '14px',
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
              ></Column>
              <Column
                style={{ background: '#2E3033', color: 'white' }}
                field="date"
                header="Date"
                bodyStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
                headerStyle={{
                  color: '#B8B8B8',
                  fontSize: '14px',
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
              ></Column>
              <Column
                style={{ background: '#2E3033', color: 'white' }}
                field="pnl"
                header="PnL"
                bodyStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                  color: '#3FB8A9',
                }}
                headerStyle={{
                  color: '#B8B8B8',
                  fontSize: '14px',
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
              ></Column>
              <Column
                style={{ background: '#2E3033', color: 'white' }}
                field="status"
                header="Status"
                bodyStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
                body={statusBodyTemplate}
                headerStyle={{
                  color: '#B8B8B8',
                  fontSize: '14px',
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
              ></Column>
              <Column
                style={{ background: '#2E3033', color: 'white' }}
                field="type"
                bodyStyle={{
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
                header="Type"
                body={typeBodyTemplate}
                headerStyle={{
                  color: '#B8B8B8',
                  fontSize: '14px',
                  borderBottomWidth: 1,
                  borderBottomColor: '#1A1B1E',
                }}
              ></Column>
            </DataTable>
          </div>
        </div>
        <div className="flex flex-col overflow-auto max-h-max p-4 text-white font-bold lg:w-[30%] w-full bg-[#2E3033] rounded-[15px]">
          <p className="text-[18px] mb-4">Notes</p>
          <div className="space-y-2">
            <div className="flex flex-row w-full place-content-between">
              <p className="text-[16px]">How to enter my trades ?</p>
              <svg
                width="25"
                height="6"
                viewBox="0 0 25 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.1875 3C5.1875 3.45737 5.04454 3.90447 4.77671 4.28476C4.50887 4.66505 4.12819 4.96144 3.68279 5.13647C3.2374 5.3115 2.7473 5.35729 2.27447 5.26807C1.80164 5.17884 1.36732 4.95859 1.02643 4.63518C0.685538 4.31177 0.453388 3.89973 0.359337 3.45115C0.265285 3.00257 0.313556 2.5376 0.498045 2.11504C0.682533 1.69249 0.994954 1.33133 1.3958 1.07723C1.79664 0.823126 2.26791 0.6875 2.75 0.6875C3.39647 0.6875 4.01645 0.931138 4.47357 1.36482C4.93069 1.79849 5.1875 2.38669 5.1875 3ZM22.25 0.6875C21.7679 0.6875 21.2966 0.823126 20.8958 1.07723C20.495 1.33133 20.1825 1.69249 19.998 2.11504C19.8136 2.5376 19.7653 3.00257 19.8593 3.45115C19.9534 3.89973 20.1855 4.31177 20.5264 4.63518C20.8673 4.95859 21.3016 5.17884 21.7745 5.26807C22.2473 5.35729 22.7374 5.3115 23.1828 5.13647C23.6282 4.96144 24.0089 4.66505 24.2767 4.28476C24.5445 3.90447 24.6875 3.45737 24.6875 3C24.6875 2.38669 24.4307 1.79849 23.9736 1.36482C23.5165 0.931138 22.8965 0.6875 22.25 0.6875ZM12.5 0.6875C12.0179 0.6875 11.5466 0.823126 11.1458 1.07723C10.745 1.33133 10.4325 1.69249 10.248 2.11504C10.0636 2.5376 10.0153 3.00257 10.1093 3.45115C10.2034 3.89973 10.4355 4.31177 10.7764 4.63518C11.1173 4.95859 11.5516 5.17884 12.0245 5.26807C12.4973 5.35729 12.9874 5.3115 13.4328 5.13647C13.8782 4.96144 14.2589 4.66505 14.5267 4.28476C14.7945 3.90447 14.9375 3.45737 14.9375 3C14.9375 2.38669 14.6807 1.79849 14.2236 1.36482C13.7665 0.931138 13.1465 0.6875 12.5 0.6875Z"
                  fill="#8F8F8F"
                />
              </svg>
            </div>
            <p className="text-[16px] font-normal">
              Nunc mattis enim ut tellus elementum sagittis. Nibh tellus
              molestie nunc non blandit massa. Enim eu turpis egestas pretium
              aenean pharetra magna. Odio tempor orci dapibus ultrices in
              iaculis. Viverra maecenas accumsan lacus vel.{' '}
            </p>
            <div className="flex flex-row w-full place-content-between">
              <p className="text-[16px]">How to avoid losses ?</p>
              <svg
                width="25"
                height="6"
                viewBox="0 0 25 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.1875 3C5.1875 3.45737 5.04454 3.90447 4.77671 4.28476C4.50887 4.66505 4.12819 4.96144 3.68279 5.13647C3.2374 5.3115 2.7473 5.35729 2.27447 5.26807C1.80164 5.17884 1.36732 4.95859 1.02643 4.63518C0.685538 4.31177 0.453388 3.89973 0.359337 3.45115C0.265285 3.00257 0.313556 2.5376 0.498045 2.11504C0.682533 1.69249 0.994954 1.33133 1.3958 1.07723C1.79664 0.823126 2.26791 0.6875 2.75 0.6875C3.39647 0.6875 4.01645 0.931138 4.47357 1.36482C4.93069 1.79849 5.1875 2.38669 5.1875 3ZM22.25 0.6875C21.7679 0.6875 21.2966 0.823126 20.8958 1.07723C20.495 1.33133 20.1825 1.69249 19.998 2.11504C19.8136 2.5376 19.7653 3.00257 19.8593 3.45115C19.9534 3.89973 20.1855 4.31177 20.5264 4.63518C20.8673 4.95859 21.3016 5.17884 21.7745 5.26807C22.2473 5.35729 22.7374 5.3115 23.1828 5.13647C23.6282 4.96144 24.0089 4.66505 24.2767 4.28476C24.5445 3.90447 24.6875 3.45737 24.6875 3C24.6875 2.38669 24.4307 1.79849 23.9736 1.36482C23.5165 0.931138 22.8965 0.6875 22.25 0.6875ZM12.5 0.6875C12.0179 0.6875 11.5466 0.823126 11.1458 1.07723C10.745 1.33133 10.4325 1.69249 10.248 2.11504C10.0636 2.5376 10.0153 3.00257 10.1093 3.45115C10.2034 3.89973 10.4355 4.31177 10.7764 4.63518C11.1173 4.95859 11.5516 5.17884 12.0245 5.26807C12.4973 5.35729 12.9874 5.3115 13.4328 5.13647C13.8782 4.96144 14.2589 4.66505 14.5267 4.28476C14.7945 3.90447 14.9375 3.45737 14.9375 3C14.9375 2.38669 14.6807 1.79849 14.2236 1.36482C13.7665 0.931138 13.1465 0.6875 12.5 0.6875Z"
                  fill="#8F8F8F"
                />
              </svg>
            </div>
            <p className="text-[16px] font-normal">
              Nunc mattis enim ut tellus elementum sagittis. Nibh tellus
              molestie nunc non blandit massa. Enim eu turpis egestas pretium
              aenean pharetra magna. Odio tempor orci dapibus ultrices in
              iaculis. Viverra maecenas accumsan lacus vel.{' '}
            </p>
            <div className="flex flex-row w-full place-content-between">
              <p className="text-[16px]">Psychology tips</p>
              <svg
                width="25"
                height="6"
                viewBox="0 0 25 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.1875 3C5.1875 3.45737 5.04454 3.90447 4.77671 4.28476C4.50887 4.66505 4.12819 4.96144 3.68279 5.13647C3.2374 5.3115 2.7473 5.35729 2.27447 5.26807C1.80164 5.17884 1.36732 4.95859 1.02643 4.63518C0.685538 4.31177 0.453388 3.89973 0.359337 3.45115C0.265285 3.00257 0.313556 2.5376 0.498045 2.11504C0.682533 1.69249 0.994954 1.33133 1.3958 1.07723C1.79664 0.823126 2.26791 0.6875 2.75 0.6875C3.39647 0.6875 4.01645 0.931138 4.47357 1.36482C4.93069 1.79849 5.1875 2.38669 5.1875 3ZM22.25 0.6875C21.7679 0.6875 21.2966 0.823126 20.8958 1.07723C20.495 1.33133 20.1825 1.69249 19.998 2.11504C19.8136 2.5376 19.7653 3.00257 19.8593 3.45115C19.9534 3.89973 20.1855 4.31177 20.5264 4.63518C20.8673 4.95859 21.3016 5.17884 21.7745 5.26807C22.2473 5.35729 22.7374 5.3115 23.1828 5.13647C23.6282 4.96144 24.0089 4.66505 24.2767 4.28476C24.5445 3.90447 24.6875 3.45737 24.6875 3C24.6875 2.38669 24.4307 1.79849 23.9736 1.36482C23.5165 0.931138 22.8965 0.6875 22.25 0.6875ZM12.5 0.6875C12.0179 0.6875 11.5466 0.823126 11.1458 1.07723C10.745 1.33133 10.4325 1.69249 10.248 2.11504C10.0636 2.5376 10.0153 3.00257 10.1093 3.45115C10.2034 3.89973 10.4355 4.31177 10.7764 4.63518C11.1173 4.95859 11.5516 5.17884 12.0245 5.26807C12.4973 5.35729 12.9874 5.3115 13.4328 5.13647C13.8782 4.96144 14.2589 4.66505 14.5267 4.28476C14.7945 3.90447 14.9375 3.45737 14.9375 3C14.9375 2.38669 14.6807 1.79849 14.2236 1.36482C13.7665 0.931138 13.1465 0.6875 12.5 0.6875Z"
                  fill="#8F8F8F"
                />
              </svg>
            </div>
            <p className="text-[16px] font-normal">
              Nunc mattis enim ut tellus elementum sagittis. Nibh tellus
              molestie nunc non blandit massa. Enim eu turpis egestas pretium
              aenean pharetra magna. Odio tempor orci dapibus ultrices in
              iaculis. Viverra maecenas accumsan lacus vel.{' '}
            </p>
            <div className="flex flex-row w-full place-content-between">
              <p className="text-[16px]">Trade management</p>
              <svg
                width="25"
                height="6"
                viewBox="0 0 25 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.1875 3C5.1875 3.45737 5.04454 3.90447 4.77671 4.28476C4.50887 4.66505 4.12819 4.96144 3.68279 5.13647C3.2374 5.3115 2.7473 5.35729 2.27447 5.26807C1.80164 5.17884 1.36732 4.95859 1.02643 4.63518C0.685538 4.31177 0.453388 3.89973 0.359337 3.45115C0.265285 3.00257 0.313556 2.5376 0.498045 2.11504C0.682533 1.69249 0.994954 1.33133 1.3958 1.07723C1.79664 0.823126 2.26791 0.6875 2.75 0.6875C3.39647 0.6875 4.01645 0.931138 4.47357 1.36482C4.93069 1.79849 5.1875 2.38669 5.1875 3ZM22.25 0.6875C21.7679 0.6875 21.2966 0.823126 20.8958 1.07723C20.495 1.33133 20.1825 1.69249 19.998 2.11504C19.8136 2.5376 19.7653 3.00257 19.8593 3.45115C19.9534 3.89973 20.1855 4.31177 20.5264 4.63518C20.8673 4.95859 21.3016 5.17884 21.7745 5.26807C22.2473 5.35729 22.7374 5.3115 23.1828 5.13647C23.6282 4.96144 24.0089 4.66505 24.2767 4.28476C24.5445 3.90447 24.6875 3.45737 24.6875 3C24.6875 2.38669 24.4307 1.79849 23.9736 1.36482C23.5165 0.931138 22.8965 0.6875 22.25 0.6875ZM12.5 0.6875C12.0179 0.6875 11.5466 0.823126 11.1458 1.07723C10.745 1.33133 10.4325 1.69249 10.248 2.11504C10.0636 2.5376 10.0153 3.00257 10.1093 3.45115C10.2034 3.89973 10.4355 4.31177 10.7764 4.63518C11.1173 4.95859 11.5516 5.17884 12.0245 5.26807C12.4973 5.35729 12.9874 5.3115 13.4328 5.13647C13.8782 4.96144 14.2589 4.66505 14.5267 4.28476C14.7945 3.90447 14.9375 3.45737 14.9375 3C14.9375 2.38669 14.6807 1.79849 14.2236 1.36482C13.7665 0.931138 13.1465 0.6875 12.5 0.6875Z"
                  fill="#8F8F8F"
                />
              </svg>
            </div>
            <p className="text-[16px] font-normal">
              Nunc mattis enim ut tellus elementum sagittis. Nibh tellus
              molestie nunc non blandit massa. Enim eu turpis egestas pretium
              aenean pharetra magna. Odio tempor orci dapibus ultrices in
              iaculis. Viverra maecenas accumsan lacus vel.{' '}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Data;
