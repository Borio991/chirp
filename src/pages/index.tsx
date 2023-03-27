import { SignIn, SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";
import Image from "next/image";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = ({ post, author }: PostWithUser) => {
  return (
    <div key={post.id} className="flex items-center gap-x-4 border-b p-4">
      <Image
        src={author!.profileImageUrl}
        alt="Profile picture"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <span>
          @{author?.username} <span>·</span>{" "}
          <span className="text-gray-400">
            {dayjs(post.createdAt).fromNow()}
          </span>{" "}
        </span>
        {post.content}
      </div>
    </div>
  );
};

const CreateWizard = () => {
  const { user } = useUser();
  return (
    <div className="flex  items-center gap-x-4">
      <img
        src={user?.profileImageUrl}
        alt="Profile Image"
        className="h-16 w-16 rounded-full"
      />
      <input
        type="text"
        placeholder="Type Some Emoji"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  const { data, isLoading } = api.posts.getAll.useQuery();
  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen justify-center">
        <div className="mx-4 w-full border-x border-slate-200 md:mx-0 md:max-w-2xl">
          <div className="flex items-center border-b border-slate-400 p-4">
            <div className="w-full">
              {!user.isSignedIn ? <SignInButton /> : <CreateWizard />}
              <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                afterSignInUrl={"/products"}
              />
            </div>
          </div>
          <div>
            {data?.map(({ post, author }) => (
              <PostView author={author} post={post} key={post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
