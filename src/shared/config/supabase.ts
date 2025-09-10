import {
  type UserResponse,
  type AuthError,
  type AuthResponse,
  type SupabaseClient,
} from '@supabase/supabase-js';
import { _supabase } from './_supabase';

class Supabase {
  private supabase: SupabaseClient;

  public constructor(base: SupabaseClient) {
    this.supabase = base;
  }

  public getSupabase = (): SupabaseClient => {
    return this.supabase;
  };

  public getSession = async () => {
    return await this.supabase.auth.getSession();
  };

  public getUser = async (): Promise<UserResponse> => {
    return await this.supabase.auth.getUser();
  };

  public signUp = async ({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<AuthResponse> => {
    return await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
  };

  public signInWithPassword = async (email: string, password: string): Promise<AuthResponse> => {
    return await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
  };

  public signOut = async (): Promise<{ error: AuthError | null }> => {
    return await this.supabase.auth.signOut();
  };

  public refreshSession = async (): Promise<AuthResponse> => {
    return await this.supabase.auth.refreshSession();
  };
}

export const supabase = new Supabase(_supabase);
