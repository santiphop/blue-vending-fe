import { Button, Dialog, DialogTitle, TextField, Typography } from '@mui/material';
import axios from 'axios';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { FormEvent, useMemo, useState } from 'react';

type Machine = {
  id: string;
  isActive: boolean;
  location: string;
};

type Product = {
  id: string;
  nameEn: string;
  nameLocal: string;
  detailEn: string | null;
  detailLocal: string | null;
  category: string | null;
};

type Inventory = {
  id: string;
  itemNumber: number;
  price: string;
  quantity: number;
  isActive: boolean;
  location: string;
  product: Product;
};

type InventoryResponse = {
  machine: Machine;
  inventories: Inventory[];
};

export const getServerSideProps = (async ({ params }) => {
  const res = await axios.get(`http://localhost:3000/api/get-inventory?itemNumber=${params?.itemNumber}`);
  return { props: { data: res.data.data as InventoryResponse } };
}) satisfies GetServerSideProps<{ data: InventoryResponse }>;

export default function Page({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState(1);

  const inventory = data.inventories.at(0);
  const totalPrice = useMemo(() => amount * parseInt(inventory!.price), [amount, inventory]);

  const COINS = (process.env.NEXT_PUBLIC_COINS ?? '').split(',').map((coin) => parseInt(coin));
  const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY;

  const [formState, setFormState] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const currencies = Object.entries(formState).map(([k, v]) => ({ value: parseInt(k), quantity: parseInt(v) }));
    try {
      const resp = await axios.post(`http://localhost:3000/api/purchase`, {
        inventoryId: inventory!.id,
        quantity: amount,
        currencies,
      });
      alert(`Changes: ${JSON.stringify(resp.data.data.changes)}`)
      router.push('/');
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <main>
      <Typography>{inventory?.product.nameEn}</Typography>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Button size="small" variant="contained" disabled={amount <= 1} onClick={() => setAmount((prev) => prev - 1)}>
          -
        </Button>
        <Typography>{amount}</Typography>
        <Button
          size="small"
          variant="contained"
          disabled={amount >= 9 || amount === inventory?.quantity}
          onClick={() => setAmount((prev) => prev + 1)}
        >
          +
        </Button>
      </div>
      <Typography>Total Price: {totalPrice}</Typography>
      <Button size="small" variant="contained" onClick={() => setModalOpen(true)}>
        Purchase now
      </Button>
      <Dialog onClose={() => setModalOpen(false)} open={modalOpen}>
        <DialogTitle>Insert your coins</DialogTitle>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', margin: '16px', gap: '8px' }}>
          {COINS.map((coin) => (
            <TextField
              key={coin}
              label={`${coin} ${CURRENCY}`}
              onChange={(e) => setFormState((prev) => ({ ...prev, [coin]: e.target.value }))}
            />
          ))}
          <Button type="submit">Insert coins</Button>
        </form>
      </Dialog>
    </main>
  );
}
