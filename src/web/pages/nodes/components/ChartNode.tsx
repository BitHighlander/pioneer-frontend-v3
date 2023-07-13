import React from 'react';
import SubmitAssetsForm from './NodeForm';

const ChartNode = () => {
  const initialAsset = {
    name: '',
    type: 'btc',
    image: '',
    caip: '',
    symbol: '',
    decimals: '',
    blockchain: '',
    facts: [],
    tags: [],
    explorer: '',
  };

  const handleSubmit = async (asset) => {
    // Handle the form submission
    console.log(asset);
  };

  return (
    <div>
      <h1>Form Example</h1>
      <SubmitAssetsForm initialAsset={initialAsset} onSubmit={handleSubmit} />
    </div>
  );
};

export default ChartNode;
