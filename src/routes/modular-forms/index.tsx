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
    .nonempty('please enter your email')
    .email('enter a valid email'),
  password: z
    .string()
    .min(1, 'please enter a password')
    .min(8, 'You password must have 8 characters or more.'),
});

type LoginForm = z.infer<typeof formSchema>;
type LoginResponse = { createdUserID: number };

const getDataAfterXms = (data: any, ms: number): Promise<any> =>
  new Promise((res) => setTimeout(() => res(data), ms));

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: '',
  password: '',
}));

export const useFormAction = formAction$<LoginForm, LoginResponse>(
  async ({ email, password }) => {
    // Runs on server
    const createdUserID = await getDataAfterXms(db.users.add({ email }), 2000);
    console.log(createdUserID);
    return {
      status: 'success',
      message: 'User added successfully',
      data: { createdUserID },
    };
  },
  zodForm$(formSchema)
);

export default component$(() => {
  const [loginForm, { Form, Field }] = useForm<LoginForm, LoginResponse>({
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
      {loginForm.response.status === 'success' && (
        <p>
          Successfully created user in DB with ID:{' '}
          {loginForm.response.data?.createdUserID}
        </p>
      )}
    </section>
  );
});

// This is just to simulate a database
const db = {
  users: {
    add: (user: { email: string }) => {
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
