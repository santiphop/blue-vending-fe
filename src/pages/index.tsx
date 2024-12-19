import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

export default function Home() {
  const [itemNumber, setItemNumber] = useState('');
  const router = useRouter();
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/${itemNumber}`);
  }

  return (
    <main>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
        <TextField
          label="Enter item number"
          size="small"
          type="tel"
          required
          onChange={(e) => setItemNumber(e.target.value)}
        />
        <Button type="submit">Submit</Button>
      </form>
    </main>
  );
}
