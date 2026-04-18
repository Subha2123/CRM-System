'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { customerService } from '@/src/services/customer';
import { LeftArrow } from '@/src/components/Icons';

export default function CreateCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Active',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      await customerService.createCustomer(form)
      router.push('/customers-list');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">


      <div className="bg-white rounded-2xl shadow w-full max-w-xl p-8 min-h-150 flex flex-col">

        <div className="flex items-center justify-start gap-2 pb-6">
          <button
            onClick={() => router.push('/customers-list')}
            className="text-sm text-blue-600"
          >
         <LeftArrow />
          </button>
          <h1 className="font-bold">Create Customer</h1>
          <div />
        </div>

        <form onSubmit={handleSubmit} className="">

          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <input
                name="name"
                placeholder="Enter name"
                value={form.name}
                onChange={handleChange}
                className="border p-2 w-full rounded-md border-gray-300  outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <input
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                className="border p-2 w-full rounded-md border-gray-300 outline-none"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <input
                name="phone"
                placeholder="Enter phone"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 w-full rounded-md border-gray-300  outline-none"
              />
            </div>

            {/* Company */}
            <div>
              <label className="text-sm font-medium mb-1 block">Company</label>
              <input
                name="company"
                placeholder="Enter company"
                value={form.company}
                onChange={handleChange}
                className="border p-2 w-full rounded-md border-gray-300  outline-none"
              />
            </div>

            {/* Status Radio */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-3 block">
                Status
              </label>

              <div className="flex gap-3">
                {['Active', 'Lead', 'Inactive'].map((s) => (
                  <label
                    key={s}
                    className={`cursor-pointer px-4 py-2 rounded-lg text-sm flex items-center gap-2 ${
                      form.status === s
                        ? 'bg-gray-600 text-white'
                        : 'bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s}
                      checked={form.status === s}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-6">
            <button
              type="button"
              onClick={() => router.push('/customers')}
              className="px-4 py-1 rounded border-none shadow bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-gray-900 text-white px-6 py-2 rounded-lg"
            >
              {loading ? 'Creating...' : 'Save'}
            </button>
          </div>
        </form>

        {error && (
          <p className="text-red-500 mt-4 text-right">{error}</p>
        )}
      </div>
    </div>
  );
}
