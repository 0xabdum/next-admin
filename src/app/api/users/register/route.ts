import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { CreateUserSchema } from '@/schema/user-schema';
import { prisma } from '@/utils/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const result = CreateUserSchema.safeParse(body);
    if (!result.success) {
      throw {
        status: 400,
        message: 'Validation failed',
        error: result.error.flatten().fieldErrors,
      };
    }

    const { username, email, password, firstName, lastName } = result.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw { status: 400, message: 'User already exist', error: null };
    }

    const hashedPassword = await bcrypt.hash(password as string, 12);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstName,
        lastName,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'User created successfully',
        user,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    // console.error('Registration error:', error);
    const err = error as
      | { message?: string; status?: number; error?: unknown }
      | undefined;
    return NextResponse.json(
      {
        status: 'failed',
        message: err?.message || 'Unknown error',
        error: err?.error || null,
      },
      { status: err?.status || 500 }
    );
  }
}
