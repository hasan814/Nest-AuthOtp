import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { Request } from "express";
import { isJWT } from "class-validator";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) { }
  async canActivate(context: ExecutionContext) {
    const httpContext = context.switchToHttp()
    const request: Request = httpContext.getRequest<Request>()
    const token = this.extractToken(request)
    request.user = await this.authService.validateAccessToken(token)
    return true
  }
  protected extractToken(request: Request) {
    const { authorization } = request.headers
    if (!authorization || authorization?.trim() == "") throw new UnauthorizedException("Login on Your Account!")
    const [bearer, token] = authorization?.split(" ")
    if (bearer?.toLowerCase() !== "bearer" || !token || !isJWT(token)) throw new UnauthorizedException("Login on your account!")
    return token
  }
}