import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Model from '@/models/Model';
import User from '@/models/User';

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
    const userId = searchParams.get('userId') || '';

    const skip = (page - 1) * limit;

    let query: any = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    
    if (userId) {
      query.userId = userId;
    }

    const models = await Model.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Manually populate user data
    const userIds = [...new Set(models.map(m => m.userId?.toString()).filter(Boolean))];
    const users = await User.find({ _id: { $in: userIds } }).select('name email').lean();
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    // Attach user data to models
    const modelsWithUsers = models.map(model => ({
      ...model,
      user: model.userId ? userMap.get(model.userId.toString()) : null,
    }));

    const total = await Model.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: modelsWithUsers,
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
    const { title, description, fileUrl, fileId, thumbnailUrl, thumbnailId, fileSize, format, tags, userId } = body;

    // Validate required fields
    if (!title || !description || !fileUrl || !fileSize || !format || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const model = await Model.create({
      title,
      description,
      fileUrl,
      fileId,
      thumbnailUrl,
      thumbnailId,
      fileSize,
      format,
      tags: tags || [],
      userId,
    });

    // Manually fetch user data
    const user = await User.findById(userId).select('name email').lean();

    return NextResponse.json(
      { 
        success: true, 
        data: {
          ...model.toObject(),
          user,
        }
      },
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
