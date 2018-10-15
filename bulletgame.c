#include <stdio.h> 


 
int main() 


 
{ 


 
	int a,x=46; 


 
	printf("\t\tBullet Game\n"); 


 
	while(x>1){ 


 
	scanf("%d",&a); 


 
	if(a<1 || a>4){ 


 
		printf("Not allowed\n"); 


 
		break; 


 
		} 


 
	else printf("%d\n",a); 


 
	if(a==1){ 


 
		x=x-a; 


 
		printf("rem:%d\n",x); 


 
		printf("comp enter:4\n"); 


 
		x=x-4; 


 
		printf("rem:%d\n",x); 


 
		} 


 
	else if(a==2) 


 
	 	{x=x-a; 


 
	 	printf("rem:%d\n",x); 


 
	 	printf("comp enter:3\n"); 


 
	 	x=x-3; 


 
	 	printf("rem:%d\n",x); 


 
	 	} 


 
	 else if(a==3) 


 
	 	{x=x-a; 


 
	 	printf("rem:%d\n",x); 


 
	 	printf("comp enter:2\n"); 


 
	 	x=x-2; 


 
	 	printf("rem:%d\n",x); 


 
	 	} 


 
	 else if(a==4) 


 
	 	{x=x-a; 


 
	 	printf("rem:%d\n",x); 


 
	 	printf("comp enter:1\n"); 


 
	 	x=x-1; 


 
	 	printf("rem:%d\n",x); 


 
	 } 


 
	 } 


 
	 printf("youloose\n"); 


 
	 printf("Try Again Losser\n"); 


 
	 return 0; 


 
} 
