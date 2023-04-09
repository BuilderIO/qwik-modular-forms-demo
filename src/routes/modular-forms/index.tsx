import { component$, $ } from '@builder.io/qwik';
import { DocumentHead } from '@builder.io/qwik-city';

import { routeLoader$, z } from '@builder.io/qwik-city';
import {
  type InitialValues,
  useForm,
  zodForm$,
  formAction$,
  SubmitHandler,
} from '@modular-forms/qwik';

const formSchema = z.object({
  email: z
    .string()
    .min(1, 'please enter your email')
    .email('enter a valid email'),
  password: z
    .string()
    .min(1, 'please enter a password')
    .min(8, 'You password must have 8 characters or more.'),
});

type LoginForm = z.infer<typeof formSchema>;

const getDataAfterXms = (data: unknown, ms: number): Promise<unknown> =>
  new Promise((res) => setTimeout(() => res(data), ms));

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: '',
  password: '',
}));

export const useFormAction = formAction$<LoginForm>(async ({ email }) => {
  // Runs on server
  const data = await getDataAfterXms(
    { success: true, user: { email, id: Math.ceil(Math.random() * 1000) } },
    2000
  );
  console.log(data);
  return data;
}, zodForm$(formSchema));

export default component$(() => {
  const [loginForm, { Form, Field }] = useForm<LoginForm>({
    loader: useFormLoader(),
    validate: zodForm$(formSchema),
    action: useFormAction(),
  });

  const handleSubmit: SubmitHandler<LoginForm> = $((values, event) => {
    // Runs on client
    console.log(values);
    console.log(event);
  });

  return (
    <>
      <section class="p-4">
        <h1>Qwik Modular Forms</h1>
        <Form onSubmit$={handleSubmit} class="flex flex-col gap-2">
          <Field name="email">
            {(field, props) => (
              <>
                <input
                  class="w-96"
                  placeholder="enter email"
                  {...props}
                  type="email"
                />
                {field.error && <div>{field.error}</div>}
              </>
            )}
          </Field>
          <Field name="password">
            {(field, props) => (
              <>
                <input
                  class={'w-96'}
                  placeholder="enter password"
                  {...props}
                  type="password"
                />
                {field.error && <div>{field.error}</div>}
              </>
            )}
          </Field>
          <button disabled={loginForm.submitting} class="w-max" type="submit">
            {loginForm.submitting ? 'submitting...' : 'Login'}
          </button>
        </Form>
        {loginForm.response.data && (
          <code>{JSON.stringify(loginForm.response)}</code>
        )}
      </section>
    </>
  );
});

// This is just to simulate a database
const db = {
  users: {
    add: (user: { name: string }) => {
      console.log(user);
      const userID = Math.floor(Math.random() * 1000);
      return userID;
    },
  },
};

export const head: DocumentHead = {
  title: 'Qwik + Modular Forms',
  meta: [
    {
      name: 'description',
      content: 'Qwik + Modular Forms',
    },
  ],
};
