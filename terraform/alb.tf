
# --------------------
# Application Load Balancer
# --------------------
resource "aws_lb" "ecs_alb" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = data.aws_subnets.public.ids
}

resource "aws_lb_target_group" "ecs_tg" {
  name        = "${var.project_name}-tg"
  port        = var.port
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.default.id

  health_check {
    path                = "/"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 5
    matcher             = "200-399"
  }
  tags = {
    Name = "${var.project_name}-tg"
  }
}

# --------------------
# Application Load Balancer - HTTPS
# --------------------
resource "aws_lb_listener" "ecs_listener_https" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type = "fixed-response"
    fixed_response {
      content_type = "text/plain"
      message_body = "Service unavailable"
      status_code  = "503"
    }
  }
}

# Optional: redirect HTTP (port 80) to HTTPS
resource "aws_lb_listener" "ecs_listener_http" {
  load_balancer_arn = aws_lb.ecs_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      protocol = "HTTPS"
      port     = "443"
      status_code = "HTTP_301"
   }
  } 
}

# Separate listener rule that attaches TG
resource "aws_lb_listener_rule" "ecs_forward_rule" {
  listener_arn = aws_lb_listener.ecs_listener_https.arn
  priority     = 1

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ecs_tg.arn
  }

  condition {
    path_pattern {
      values = ["/*"]
    }
  }
  depends_on = [aws_lb_target_group.ecs_tg]

  lifecycle {
    create_before_destroy = true
  }
}
