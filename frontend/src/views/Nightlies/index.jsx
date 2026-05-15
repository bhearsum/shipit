import RefreshIcon from '@mui/icons-material/Refresh';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getNightlyBuilds } from '../../components/api';
import Dashboard from '../../components/Dashboard';
import ErrorPanel from '../../components/ErrorPanel';
import useAction from '../../hooks/useAction';

const PRODUCTS = ['', 'firefox', 'devedition', 'thunderbird'];

export default function Nightlies() {
  const [product, setProduct] = useState('firefox');
  const [version, setVersion] = useState('');
  const [builds, fetchBuilds] = useAction(getNightlyBuilds);

  const reload = () => {
    fetchBuilds({ product: product || undefined, version: version || undefined, limit: 100 });
  };

  useEffect(() => {
    reload();
  }, [product, version]);

  return (
    <Dashboard group="Nightlies" title="Nightly Builds">
      <ErrorPanel error={builds.error && builds.error.toString()} />
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl variant="standard" sx={{ minWidth: 160 }}>
            <InputLabel>Product</InputLabel>
            <Select value={product} onChange={(e) => setProduct(e.target.value)}>
              {PRODUCTS.map((p) => (
                <MenuItem value={p} key={p || 'all'}>
                  {p || '(all)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Version filter"
            variant="standard"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="e.g. 140.0a1"
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button component={Link} to="/nightlies/new" variant="contained">
            New Nightly Build
          </Button>
          <Button startIcon={<RefreshIcon />} onClick={reload}>
            Refresh
          </Button>
        </Box>
      </Box>

      {builds.loading && (
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Box>
      )}

      {builds.data && builds.data.length === 0 && <h3>No nightly builds.</h3>}

      {builds.data && builds.data.length > 0 && (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Build ID</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Locales</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {builds.data.map((nb) => (
                <TableRow key={nb.id}>
                  <TableCell>{nb.product}</TableCell>
                  <TableCell>{nb.channel}</TableCell>
                  <TableCell>{nb.version}</TableCell>
                  <TableCell>{nb.buildid}</TableCell>
                  <TableCell>{nb.created}</TableCell>
                  <TableCell>
                    <details>
                      <summary>{nb.locales.length} locales</summary>
                      {nb.locales.join(', ')}
                    </details>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Dashboard>
  );
}
