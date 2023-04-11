namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXT_PUBLIC_BASE_URL: string;
    NEXTAUTH_SECRET: string;
    EMAIL: string;
    EMAIL_PASS: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLIC_KEY: string;
    STRIPE_SIGNING_SECRET: string;
  }
}
