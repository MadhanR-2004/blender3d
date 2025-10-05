import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Model from '@/models/Model';

// GET all models
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ],
      };
    }

    const models = await Model.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Model.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: models,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch models' },
      { status: 500 }
    );
  }
}

// POST create a new model
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { title, description, fileUrl, thumbnailUrl, fileSize, format, tags, userId, userName } = body;

    // Validate required fields
    if (!title || !description || !fileUrl || !fileSize || !format || !userId || !userName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const model = await Model.create({
      title,
      description,
      fileUrl,
      thumbnailUrl,
      fileSize,
      format,
      tags: tags || [],
      userId,
      userName,
    });

    return NextResponse.json(
      { success: true, data: model },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create model' },
      { status: 500 }
    );
  }
}
