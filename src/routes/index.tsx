import { component$ } from '@builder.io/qwik';
import { DocumentHead, Form } from '@builder.io/qwik-city';

import { routeAction$, zod$, z } from '@builder.io/qwik-city';

export const useAddUser = routeAction$(
  (user, { fail }) => {
    // `user` is typed { name: string }
    const userID = db.users.add(user);
    return {
      success: true,
      userID,
    };
  },
  zod$({
    name: z.string().nonempty(),
  })
);

export default component$(() => {
  const action = useAddUser();
  return (
    <>
      <section class="p-4">
        <h1>Qwik Server forms</h1>
        <Form action={action} class="flex flex-col gap-2">
          <input name="name" class="w-96" placeholder="enter user name" />
          {action.value?.failed && <div>{action.value.fieldErrors?.name}</div>}
          {action.value?.success && (
            <div>User added successfully with ID: {action.value.userID}</div>
          )}
          <button class="w-max" type="submit">
            Add user
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
  title: 'Qwik Forms',
  meta: [
    {
      name: 'description',
      content: 'Qwik Forms',
    },
  ],
};
