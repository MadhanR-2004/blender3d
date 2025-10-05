import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Model from '@/models/Model';
import User from '@/models/User';
import getGridFSBucket from '@/lib/gridfs';
import { ObjectId } from 'mongodb';

// GET a single model by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const skipViewCount = request.nextUrl.searchParams.get('skipViewCount');

    const model = await Model.findById(id).lean();

    if (!model) {
      return NextResponse.json(
        { success: false, error: 'Model not found' },
        { status: 404 }
      );
    }

    // Manually fetch user data
    const user = model.userId ? await User.findById(model.userId).select('name email').lean() : null;

    // Increment view count if not skipped
    if (!skipViewCount) {
      await Model.findByIdAndUpdate(id, { $inc: { views: 1 } });
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...model,
        user,
      }
    });
  } catch (error) {
    console.error('Error fetching model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch model' },
      { status: 500 }
    );
  }
}

// PUT update a model
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const body = await request.json();
    const model = await Model.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    }).lean();

    if (!model) {
      return NextResponse.json(
        { success: false, error: 'Model not found' },
        { status: 404 }
      );
    }

    // Manually fetch user data
    const user = model.userId ? await User.findById(model.userId).select('name email').lean() : null;

    return NextResponse.json({ success: true, data: { ...model, user } });
  } catch (error) {
    console.error('Error updating model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update model' },
      { status: 500 }
    );
  }
}

// DELETE a model
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const model = await Model.findById(id);

    if (!model) {
      return NextResponse.json(
        { success: false, error: 'Model not found' },
        { status: 404 }
      );
    }

    // Delete file from GridFS if fileId exists
    if (model.fileId) {
      try {
        const bucket = getGridFSBucket();
        await bucket.delete(new ObjectId(model.fileId));
      } catch (error) {
        console.error('Error deleting file from GridFS:', error);
      }
    }

    // Delete the model document
    await Model.findByIdAndDelete(id);

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting model:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete model' },
      { status: 500 }
    );
  }
}
