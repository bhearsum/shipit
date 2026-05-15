import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { submitNightlyBuild } from '../../components/api';
import Dashboard from '../../components/Dashboard';
import ErrorPanel from '../../components/ErrorPanel';
import useAction from '../../hooks/useAction';

const PRODUCTS = ['firefox', 'devedition', 'thunderbird'];

export default function NewNightlyBuild() {
  const navigate = useNavigate();
  const [product, setProduct] = useState('firefox');
  const [channel, setChannel] = useState('nightly');
  const [version, setVersion] = useState('');
  const [buildid, setBuildid] = useState('');
  const [localesText, setLocalesText] = useState('');
  const [error, setError] = useState(null);
  const [submitState, submitAction] = useAction(submitNightlyBuild);

  const parsedLocales = localesText
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const readyToSubmit =
    product && channel && version && buildid && parsedLocales.length > 0 && !submitState.loading;

  const handleSubmit = async () => {
    setError(null);
    const result = await submitAction({
      product,
      channel,
      version,
      buildid,
      locales: parsedLocales,
    });
    if (result.error) {
      setError(`Could not submit nightly build: ${result.error.toString()}`);
      return;
    }
    navigate('/nightlies');
  };

  return (
    <Dashboard group="Nightlies" title="New Nightly Build">
      <ErrorPanel error={error} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
        <FormControl variant="standard">
          <InputLabel>Product</InputLabel>
          <Select value={product} onChange={(e) => setProduct(e.target.value)}>
            {PRODUCTS.map((p) => (
              <MenuItem value={p} key={p}>
                {p}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Channel"
          variant="standard"
          value={channel}
          onChange={(e) => setChannel(e.target.value)}
        />
        <TextField
          label="Version"
          variant="standard"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
          placeholder="e.g. 140.0a1"
        />
        <TextField
          label="Build ID"
          variant="standard"
          value={buildid}
          onChange={(e) => setBuildid(e.target.value)}
          placeholder="e.g. 20250101010110"
        />
        <TextField
          label="Locales"
          variant="standard"
          value={localesText}
          onChange={(e) => setLocalesText(e.target.value)}
          multiline
          minRows={3}
          helperText="Comma- or whitespace-separated list of locale codes (e.g. af, de, en-US)"
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="primary"
            variant="contained"
            disabled={!readyToSubmit}
            onClick={handleSubmit}
          >
            Submit
          </Button>
          {submitState.loading && <CircularProgress size={24} />}
        </Box>
      </Box>
    </Dashboard>
  );
}
