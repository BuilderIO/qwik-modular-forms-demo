import { component$ } from '@builder.io/qwik';
import { DocumentHead, Form } from '@builder.io/qwik-city';

import { routeLoader$, z } from '@builder.io/qwik-city';
import { InitialValues, useForm } from '@modular-forms/qwik';

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

export const useFormLoader = routeLoader$<InitialValues<LoginForm>>(() => ({
  email: '',
  password: '',
}));

export default component$(() => {
  const [loginForm, { Form, Field, FieldArray }] = useForm<LoginForm>({
    loader: useFormLoader(),
  });
  return (
    <>
      <section class="p-4">
        <h1>Qwik Modular Forms</h1>
        <Form class="flex flex-col gap-2">
          <Field name="email">
            {(field, props) => (
              <input
                class="w-96"
                placeholder="enter email"
                {...props}
                type="email"
              />
            )}
          </Field>
          <Field name="password">
            {(field, props) => (
              <input
                class="w-96"
                placeholder="enter password"
                {...props}
                type="password"
              />
            )}
          </Field>
          <button class="w-max" type="submit">
            Login
          </button>
        </Form>
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
